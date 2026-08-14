import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyParams } from "@/lib/vnpay/sign";
import { vnpayConfig } from "@/lib/vnpay/client";

// VNPay calls this server-to-server (a GET request, despite "IPN" sounding
// like a webhook POST) to confirm payment. This is the ONLY code path
// allowed to flip an Order to PAID/FAILED -- see the note in
// thanh-toan/ket-qua/page.tsx for why the browser return URL must not do
// this itself. No session/auth here: the HMAC signature check below *is*
// this endpoint's authentication.
export async function GET(req: NextRequest) {
  const params: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  if (!verifyParams(params, vnpayConfig.hashSecret)) {
    return NextResponse.json({ RspCode: "97", Message: "Checksum failed" });
  }

  const order = await prisma.order.findUnique({ where: { vnpTxnRef: params.vnp_TxnRef } });
  if (!order) {
    return NextResponse.json({ RspCode: "01", Message: "Order not found" });
  }

  const vnpAmount = Number(params.vnp_Amount) / 100;
  if (vnpAmount !== order.totalVnd) {
    return NextResponse.json({ RspCode: "04", Message: "Invalid amount" });
  }

  if (order.status !== "PENDING") {
    // Already confirmed by a previous IPN call -- VNPay retries until it
    // gets a "00", so this must be idempotent rather than an error.
    return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });
  }

  const isSuccess = params.vnp_ResponseCode === "00";
  const updated = await prisma.order.updateMany({
    where: { id: order.id, status: "PENDING" },
    data: {
      status: isSuccess ? "PAID" : "FAILED",
      paidAt: isSuccess ? new Date() : null,
      vnpTransactionNo: params.vnp_TransactionNo ?? null,
      vnpBankCode: params.vnp_BankCode ?? null,
      vnpResponseCode: params.vnp_ResponseCode ?? null,
      vnpPayDate: params.vnp_PayDate ?? null,
    },
  });

  if (updated.count === 0) {
    // Lost a race with a concurrent IPN retry -- still an idempotent no-op.
    return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });
  }

  return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
}
