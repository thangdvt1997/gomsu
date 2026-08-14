import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageSpeedChecker } from "@/components/admin/PageSpeedChecker";
import { markChecklistItemAction } from "@/lib/actions/admin-seo-checklist";
import {
  SEO_CHECKLIST_ITEMS,
  SEO_CHECKLIST_SETTING_KEY,
  SEO_CHECKLIST_STALE_DAYS,
  type SeoChecklistState,
} from "@/lib/seo-checklist";
import { gscConfigured, getTopQueries, getTopPages } from "@/lib/integrations/gsc";
import { bingConfigured, getBingQueryStats } from "@/lib/integrations/bing";
import { getIndexNowKey } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com";

type Entry = { label: string; href: string; value: string };

function findDuplicates(entries: Entry[]): Map<string, Entry[]> {
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = entry.value.trim().toLowerCase();
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  for (const [key, items] of groups) {
    if (items.length < 2) groups.delete(key);
  }
  return groups;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
}

export default async function AdminSeoPage() {
  const [products, posts, checklistRow, indexNowKey] = await Promise.all([
    prisma.product.findMany({
      where: { isDraft: false },
      select: { name: true, slug: true, metaTitle: true, metaDescription: true },
    }),
    prisma.post.findMany({
      select: { title: true, slug: true, metaTitle: true, metaDescription: true },
    }),
    prisma.siteSetting.findUnique({ where: { key: SEO_CHECKLIST_SETTING_KEY } }),
    getIndexNowKey(),
  ]);

  const checklistState: SeoChecklistState = checklistRow ? JSON.parse(checklistRow.value) : {};

  const titleEntries: Entry[] = [
    ...products.map((p) => ({ label: p.name, href: `/admin/products`, value: p.metaTitle ?? "" })),
    ...posts.map((p) => ({ label: p.title, href: `/admin/posts`, value: p.metaTitle ?? "" })),
  ];
  const descEntries: Entry[] = [
    ...products.map((p) => ({ label: p.name, href: `/admin/products`, value: p.metaDescription ?? "" })),
    ...posts.map((p) => ({ label: p.title, href: `/admin/posts`, value: p.metaDescription ?? "" })),
  ];

  const duplicateTitles = findDuplicates(titleEntries);
  const duplicateDescriptions = findDuplicates(descEntries);

  const noCustomSeoCount =
    products.filter((p) => !p.metaTitle && !p.metaDescription).length +
    posts.filter((p) => !p.metaTitle && !p.metaDescription).length;

  let gscQueries: Awaited<ReturnType<typeof getTopQueries>> = [];
  let gscPages: Awaited<ReturnType<typeof getTopPages>> = [];
  let gscError: string | null = null;
  if (gscConfigured()) {
    try {
      [gscQueries, gscPages] = await Promise.all([getTopQueries(28, 10), getTopPages(28, 10)]);
    } catch (err) {
      gscError = err instanceof Error ? err.message : "Không lấy được dữ liệu Search Console.";
    }
  }

  let bingStats: Awaited<ReturnType<typeof getBingQueryStats>> = [];
  let bingError: string | null = null;
  if (bingConfigured()) {
    try {
      bingStats = (await getBingQueryStats()).slice(0, 10);
    } catch (err) {
      bingError = err instanceof Error ? err.message : "Không lấy được dữ liệu Bing Webmaster.";
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>SEO</h1>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="admin-stat">
          <b>{duplicateTitles.size}</b>
          <span>Nhóm meta title trùng nhau</span>
        </div>
        <div className="admin-stat">
          <b>{duplicateDescriptions.size}</b>
          <span>Nhóm meta description trùng nhau</span>
        </div>
        <div className="admin-stat">
          <b>{noCustomSeoCount}</b>
          <span>Trang chưa tuỳ chỉnh SEO (dùng mặc định)</span>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Checklist SEO hàng tuần</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {SEO_CHECKLIST_ITEMS.map((item) => {
            const lastChecked = checklistState[item.key];
            const stale = !lastChecked || daysSince(lastChecked) > SEO_CHECKLIST_STALE_DAYS;
            return (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--a-line)",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{item.label}</p>
                  <p style={{ margin: "2px 0 0", fontSize: ".82rem", color: "var(--a-ink-soft)" }}>{item.hint}</p>
                  <p style={{ margin: "4px 0 0", fontSize: ".78rem", color: stale ? "#a83232" : "#1f6b1f" }}>
                    {lastChecked ? `Lần cuối: ${formatDate(lastChecked)}` : "Chưa kiểm tra lần nào"}
                    {stale ? " — cần kiểm tra lại" : ""}
                  </p>
                </div>
                <form action={markChecklistItemAction.bind(null, item.key)}>
                  <button className="btn btn-sm btn-outline" type="submit">
                    Đánh dấu đã kiểm tra
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </div>

      <PageSpeedChecker defaultUrl={siteUrl} />

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Google Search Console</h3>
        {!gscConfigured() ? (
          <div style={{ fontSize: ".88rem", color: "var(--a-ink-soft)" }}>
            <p>Chưa cấu hình. Để bật, cần:</p>
            <ol style={{ paddingLeft: 18 }}>
              <li>Tạo service account trong Google Cloud Console, tải file JSON key.</li>
              <li>
                Vào Google Search Console → chọn site → Settings → Users and permissions → Add user → dán email của
                service account (dạng ...@...iam.gserviceaccount.com), quyền &quot;Restricted&quot; là đủ.
              </li>
              <li>
                Gửi nội dung file JSON key cho xưởng để cấu hình biến môi trường{" "}
                <code>GSC_SERVICE_ACCOUNT_JSON</code> trên server.
              </li>
            </ol>
          </div>
        ) : gscError ? (
          <p style={{ color: "#a83232" }}>{gscError}</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <h4>Từ khoá hàng đầu (28 ngày)</h4>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Từ khoá</th>
                    <th>Click</th>
                    <th>Vị trí TB</th>
                  </tr>
                </thead>
                <tbody>
                  {gscQueries.map((row) => (
                    <tr key={row.keys[0]}>
                      <td>{row.keys[0]}</td>
                      <td>{row.clicks}</td>
                      <td>{row.position.toFixed(1)}</td>
                    </tr>
                  ))}
                  {gscQueries.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ color: "var(--a-ink-soft)" }}>
                        Chưa có dữ liệu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <h4>Trang được click nhiều nhất (28 ngày)</h4>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Trang</th>
                    <th>Click</th>
                    <th>CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {gscPages.map((row) => (
                    <tr key={row.keys[0]}>
                      <td style={{ wordBreak: "break-all" }}>{row.keys[0].replace(siteUrl, "")}</td>
                      <td>{row.clicks}</td>
                      <td>{(row.ctr * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                  {gscPages.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ color: "var(--a-ink-soft)" }}>
                        Chưa có dữ liệu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Bing Webmaster Tools</h3>
        {!bingConfigured() ? (
          <div style={{ fontSize: ".88rem", color: "var(--a-ink-soft)" }}>
            <p>Chưa cấu hình. Để bật, cần:</p>
            <ol style={{ paddingLeft: 18 }}>
              <li>
                Thêm và xác minh site tại{" "}
                <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener">
                  Bing Webmaster Tools
                </a>
                .
              </li>
              <li>Vào Settings (góc phải) → API Access → đồng ý điều khoản → Generate API Key.</li>
              <li>
                Gửi API key cho xưởng để cấu hình biến môi trường <code>BING_WEBMASTER_API_KEY</code> trên server.
              </li>
            </ol>
          </div>
        ) : bingError ? (
          <p style={{ color: "#a83232" }}>{bingError}</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Từ khoá</th>
                <th>Click</th>
                <th>Lượt hiển thị</th>
                <th>Vị trí TB khi click</th>
              </tr>
            </thead>
            <tbody>
              {bingStats.map((row, i) => (
                <tr key={i}>
                  <td>{row.query}</td>
                  <td>{row.clicks}</td>
                  <td>{row.impressions}</td>
                  <td>{row.avgClickPosition ?? "—"}</td>
                </tr>
              ))}
              {bingStats.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ color: "var(--a-ink-soft)" }}>
                    Chưa có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>IndexNow</h3>
        <p style={{ fontSize: ".88rem", color: "var(--a-ink-soft)" }}>
          Tự động báo Bing (và các công cụ tìm kiếm khác hỗ trợ IndexNow) mỗi khi sản phẩm/bài viết được đăng hoặc
          cập nhật — không cần chờ họ tự quét lại site. Đã hoạt động tự động, không cần cấu hình gì thêm.
        </p>
        <p style={{ fontSize: ".82rem", color: "var(--a-ink-soft)" }}>
          Key xác minh: <code>{indexNowKey}</code>
        </p>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Meta title trùng lặp</h3>
        {duplicateTitles.size === 0 ? (
          <p style={{ color: "var(--a-ink-soft)", margin: 0 }}>Không có meta title nào bị trùng. Tốt!</p>
        ) : (
          [...duplicateTitles.entries()].map(([value, items]) => (
            <div key={value} style={{ marginBottom: 14 }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700 }}>&quot;{items[0].value}&quot;</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: "var(--a-ink-soft)", fontSize: ".88rem" }}>
                {items.map((item, i) => (
                  <li key={i}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="admin-panel">
        <h3 style={{ marginTop: 0 }}>Meta description trùng lặp</h3>
        {duplicateDescriptions.size === 0 ? (
          <p style={{ color: "var(--a-ink-soft)", margin: 0 }}>Không có meta description nào bị trùng. Tốt!</p>
        ) : (
          [...duplicateDescriptions.entries()].map(([value, items]) => (
            <div key={value} style={{ marginBottom: 14 }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700 }}>&quot;{items[0].value}&quot;</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: "var(--a-ink-soft)", fontSize: ".88rem" }}>
                {items.map((item, i) => (
                  <li key={i}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  );
}
