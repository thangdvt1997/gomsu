// VietQR (NAPAS 247) public image API -- generates a bank-transfer QR code
// directly from the workshop's own bank account, no payment-gateway
// merchant account/approval needed. See https://www.vietqr.io/danh-sach-api
// The bank identifier accepted by img.vietqr.io is the bank's NAPAS BIN
// code (e.g. TPBank = 970423) -- double-check this against VietQR's
// published bank list if the account is ever moved to a different bank.
const VIETQR_BANK_ID = process.env.VIETQR_BANK_ID ?? "";
const VIETQR_ACCOUNT_NO = process.env.VIETQR_ACCOUNT_NO ?? "";
const VIETQR_ACCOUNT_NAME = process.env.VIETQR_ACCOUNT_NAME ?? "";

export function vietqrConfigured(): boolean {
  return Boolean(VIETQR_BANK_ID && VIETQR_ACCOUNT_NO);
}

export function buildVietQrImageUrl(opts: { amountVnd: number; addInfo: string }): string {
  const params = new URLSearchParams({
    amount: String(Math.round(opts.amountVnd)),
    addInfo: opts.addInfo,
  });
  if (VIETQR_ACCOUNT_NAME) params.set("accountName", VIETQR_ACCOUNT_NAME);
  return `https://img.vietqr.io/image/${VIETQR_BANK_ID}-${VIETQR_ACCOUNT_NO}-compact2.png?${params.toString()}`;
}

export const bankAccountDisplay = {
  bankId: VIETQR_BANK_ID,
  accountNo: VIETQR_ACCOUNT_NO,
  accountName: VIETQR_ACCOUNT_NAME,
};
