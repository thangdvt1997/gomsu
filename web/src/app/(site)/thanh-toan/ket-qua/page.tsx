import Link from "next/link";
import { prisma } from "@/lib/db";
import { verifyParams } from "@/lib/vnpay/sign";
import { vnpayConfig } from "@/lib/vnpay/client";
import { formatVnd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function VnpayReturnPage({
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

  // IMPORTANT: status shown here comes from the DATABASE, never from
  // vnp_ResponseCode in this URL -- this page is just a browser redirect
  // target and can be replayed/tampered with by the customer. The IPN
  // handler (server-to-server) is the only thing allowed to mark an order
  // PAID. If the IPN hasn't landed yet, we show a "processing" state.
  let content: React.ReactNode;
  if (!signatureValid || !order) {
    content = (
      <>
        <h1>Không tìm thấy thông tin đơn hàng</h1>
        <p>Vui lòng kiểm tra lại hoặc liên hệ xưởng để được hỗ trợ.</p>
      </>
    );
  } else if (order.status === "PAID") {
    content = (
      <>
        <h1>Thanh toán thành công!</h1>
        <p>
          Đơn hàng <b>{order.orderNumber}</b> — tổng tiền {formatVnd(order.totalVnd)} — đã được thanh toán. Xưởng
          sẽ liên hệ để xác nhận giao hàng.
        </p>
      </>
    );
  } else if (order.status === "FAILED") {
    content = (
      <>
        <h1>Thanh toán không thành công</h1>
        <p>
          Đơn hàng <b>{order.orderNumber}</b> chưa được thanh toán. Vui lòng thử lại hoặc liên hệ xưởng để được hỗ
          trợ.
        </p>
      </>
    );
  } else {
    content = (
      <>
        <h1>Đang xử lý thanh toán...</h1>
        <p>
          Đơn hàng <b>{order.orderNumber}</b> đang được xác nhận. Vui lòng đợi trong giây lát rồi tải lại trang, hoặc
          kiểm tra email/điện thoại để nhận xác nhận từ xưởng.
        </p>
      </>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "calc(var(--header-h) + 60px)", paddingBottom: 80, maxWidth: 640 }}>
      {content}
      <Link className="btn btn-outline" href="/">
        Về trang chủ
      </Link>
    </div>
  );
}
