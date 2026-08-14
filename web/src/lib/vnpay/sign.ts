import crypto from "node:crypto";

// VNPay's signature scheme: sort params by key, join as
// `key=value&key=value...` (values percent-encoded VNPay's way -- spaces as
// "+", matching their official PHP/Node samples), then HMAC-SHA512 with the
// merchant's hash secret. Shared by checkout (sign), the return-URL page,
// and the IPN handler (both verify) so all three encode identically.

function vnpEncode(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

function buildSignData(params: Record<string, string>): string {
  return Object.keys(params)
    .sort()
    .map((key) => `${key}=${vnpEncode(params[key])}`)
    .join("&");
}

export function signParams(params: Record<string, string>, secret: string): string {
  const signData = buildSignData(params);
  return crypto.createHmac("sha512", secret).update(Buffer.from(signData, "utf-8")).digest("hex");
}

/** Builds the exact query string used both for the redirect URL and the signature, so they can never drift apart. */
export function buildSignedQuery(params: Record<string, string>, secret: string): string {
  const hash = signParams(params, secret);
  return `${buildSignData(params)}&vnp_SecureHash=${hash}`;
}

export function verifyParams(allParams: Record<string, string>, secret: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { vnp_SecureHash, vnp_SecureHashType, ...rest } = allParams;
  if (!vnp_SecureHash) return false;
  const expected = signParams(rest, secret);
  // Timing-safe compare of two same-length hex strings; falls back to false on length mismatch.
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(vnp_SecureHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
