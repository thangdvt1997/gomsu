import { getSettings, SETTING_KEYS } from "@/lib/settings";
import { updateSettingsAction } from "@/lib/actions/admin-settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <div className="admin-topbar">
        <h1>Cài đặt</h1>
      </div>

      <form action={updateSettingsAction}>
        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>Google Analytics &amp; Tag Manager</h3>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <input
              type="checkbox"
              name="analyticsEnabled"
              defaultChecked={settings[SETTING_KEYS.ANALYTICS_ENABLED] === "true"}
            />
            Bật theo dõi Analytics trên site
          </label>
          <div className="form-row">
            <div className="field">
              <label>Google Analytics 4 ID</label>
              <input type="text" name="ga4Id" defaultValue={settings[SETTING_KEYS.GA4_ID] ?? ""} placeholder="G-XXXXXXXXXX" />
            </div>
            <div className="field">
              <label>Google Tag Manager ID</label>
              <input type="text" name="gtmId" defaultValue={settings[SETTING_KEYS.GTM_ID] ?? ""} placeholder="GTM-XXXXXXX" />
            </div>
          </div>
        </div>

        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>Xác minh công cụ tìm kiếm</h3>
          <p style={{ color: "var(--a-ink-soft)", fontSize: ".85rem" }}>
            Dán mã xác minh (chỉ phần nội dung, không cần thẻ &lt;meta&gt;) từ Google Search Console / Bing Webmaster
            Tools.
          </p>
          <div className="form-row">
            <div className="field">
              <label>Google Search Console verification</label>
              <input type="text" name="gscVerification" defaultValue={settings[SETTING_KEYS.GSC_VERIFICATION] ?? ""} />
            </div>
            <div className="field">
              <label>Bing Webmaster verification</label>
              <input type="text" name="bingVerification" defaultValue={settings[SETTING_KEYS.BING_VERIFICATION] ?? ""} />
            </div>
          </div>
        </div>

        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>Thông báo qua email</h3>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <input
              type="checkbox"
              name="notifyEmailEnabled"
              defaultChecked={settings[SETTING_KEYS.NOTIFY_EMAIL_ENABLED] === "true"}
            />
            Gửi email khi có đơn hàng/liên hệ mới
          </label>
          <div className="field">
            <label>Email nhận thông báo</label>
            <input type="email" name="notifyEmail" defaultValue={settings[SETTING_KEYS.NOTIFY_EMAIL] ?? ""} placeholder="ban@gmail.com" />
          </div>
          <p style={{ color: "var(--a-ink-soft)", fontSize: ".85rem", marginBottom: 0 }}>
            Cần cấu hình thêm biến môi trường <code>SMTP_USER</code>/<code>SMTP_APP_PASSWORD</code> trên server để
            gửi được email (liên hệ để được hỗ trợ thiết lập).
          </p>
        </div>

        <button className="btn btn-primary" type="submit">Lưu cài đặt</button>
      </form>
    </>
  );
}
