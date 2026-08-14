import { buildSignedQuery } from "@/lib/vnpay/sign";

export const vnpayConfig = {
  tmnCode: process.env.VNPAY_TMN_CODE ?? "",
  hashSecret: process.env.VNPAY_HASH_SECRET ?? "",
  paymentUrl: process.env.VNPAY_PAYMENT_URL ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl: process.env.VNPAY_RETURN_URL ?? "",
  version: process.env.VNPAY_VERSION ?? "2.1.0",
  currency: process.env.VNPAY_CURRENCY ?? "VND",
  locale: process.env.VNPAY_LOCALE ?? "vn",
};

/** yyyyMMddHHmmss in Asia/Ho_Chi_Minh, as VNPay's vnp_CreateDate expects. */
function vnpDate(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}${get("month")}${get("day")}${get("hour")}${get("minute")}${get("second")}`;
}

export function buildVnpayPaymentUrl(opts: {
  txnRef: string;
  amountVnd: number;
  orderInfo: string;
  ipAddr: string;
}): string {
  const params: Record<string, string> = {
    vnp_Version: vnpayConfig.version,
    vnp_Command: "pay",
    vnp_TmnCode: vnpayConfig.tmnCode,
    // VNPay expects the amount multiplied by 100 (no decimal places).
    vnp_Amount: String(Math.round(opts.amountVnd * 100)),
    vnp_CurrCode: vnpayConfig.currency,
    vnp_TxnRef: opts.txnRef,
    vnp_OrderInfo: opts.orderInfo,
    vnp_OrderType: "other",
    vnp_Locale: vnpayConfig.locale,
    vnp_ReturnUrl: vnpayConfig.returnUrl,
    vnp_IpAddr: opts.ipAddr,
    vnp_CreateDate: vnpDate(new Date()),
  };
  return `${vnpayConfig.paymentUrl}?${buildSignedQuery(params, vnpayConfig.hashSecret)}`;
}
