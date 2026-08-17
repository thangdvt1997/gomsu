import Link from "next/link";
import { prisma } from "@/lib/db";
import { verifyParams } from "@/lib/vnpay/sign";
import { vnpayConfig } from "@/lib/vnpay/client";
import { formatVnd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EnglishVnpayReturnPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string") params[k] = v;
  }

  const signatureValid = Object.keys(params).length > 0 && verifyParams(params, vnpayConfig.hashSecret);
  const txnRef = params.vnp_TxnRef;
  const order = txnRef ? await prisma.order.findUnique({ where: { vnpTxnRef: txnRef } }) : null;

  // Same note as the Vietnamese version: status shown here comes from the
  // DATABASE, never from vnp_ResponseCode in this URL.
  let content: React.ReactNode;
  if (!signatureValid || !order) {
    content = (
      <>
        <h1>Order Not Found</h1>
        <p>Please check again or contact us for support.</p>
      </>
    );
  } else if (order.status === "PAID") {
    content = (
      <>
        <h1>Payment Successful!</h1>
        <p>
          Order <b>{order.orderNumber}</b> — total {formatVnd(order.totalVnd)} — has been paid. We&apos;ll contact
          you to confirm delivery.
        </p>
      </>
    );
  } else if (order.status === "FAILED") {
    content = (
      <>
        <h1>Payment Failed</h1>
        <p>
          Order <b>{order.orderNumber}</b> has not been paid. Please try again or contact us for support.
        </p>
      </>
    );
  } else {
    content = (
      <>
        <h1>Processing Payment...</h1>
        <p>
          Order <b>{order.orderNumber}</b> is being confirmed. Please wait a moment and reload the page, or check
          your email/phone for confirmation from us.
        </p>
      </>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "calc(var(--header-h) + 60px)", paddingBottom: 80, maxWidth: 640 }}>
      {content}
      <Link className="btn btn-outline" href="/en">
        Back to Home
      </Link>
    </div>
  );
}
