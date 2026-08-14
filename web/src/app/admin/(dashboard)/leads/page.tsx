import { prisma } from "@/lib/db";
import { updateLeadStatusAction, setLeadTagAction } from "@/lib/actions/admin-leads";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  QUOTE_REQUEST: "Yêu cầu báo giá",
  CONTACT_MESSAGE: "Liên hệ chung",
};

const TAG_SUGGESTIONS = ["Khách sỉ", "VIP", "Khách quen", "Doanh nghiệp"];

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag: tagFilter } = await searchParams;

  const leads = await prisma.lead.findMany({
    where: tagFilter ? { tag: tagFilter } : undefined,
    include: { product: { select: { name: true, code: true } } },
    orderBy: { createdAt: "desc" },
  });

  const allTags = await prisma.lead.findMany({
    where: { tag: { not: null } },
    select: { tag: true },
    distinct: ["tag"],
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Liên hệ &amp; Yêu cầu báo giá</h1>
      </div>

      {allTags.length > 0 && (
        <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: ".85rem", color: "var(--a-ink-soft)" }}>Lọc theo nhãn:</span>
          <a href="/admin/leads" className={`tag-pill${!tagFilter ? " is-checked" : ""}`}>
            Tất cả
          </a>
          {allTags.map(
            (t) =>
              t.tag && (
                <a key={t.tag} href={`/admin/leads?tag=${encodeURIComponent(t.tag)}`} className={`tag-pill${tagFilter === t.tag ? " is-checked" : ""}`}>
                  {t.tag}
                </a>
              ),
          )}
        </div>
      )}

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Loại</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Nội dung</th>
              <th>Nhãn</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{new Intl.DateTimeFormat("vi-VN").format(lead.createdAt)}</td>
                <td>{KIND_LABEL[lead.kind] ?? lead.kind}</td>
                <td>
                  {lead.name}
                  <br />
                  <span style={{ color: "var(--a-ink-soft)", fontSize: ".8rem" }}>
                    {lead.phone}
                    {lead.email && ` · ${lead.email}`}
                  </span>
                </td>
                <td>{lead.product ? `${lead.product.name} (${lead.product.code})` : "—"}</td>
                <td style={{ maxWidth: 260, whiteSpace: "pre-wrap" }}>{lead.message}</td>
                <td>
                  <form action={setLeadTagAction.bind(null, lead.id)} style={{ display: "flex", gap: 4 }}>
                    <input
                      type="text"
                      name="tag"
                      defaultValue={lead.tag ?? ""}
                      list="tag-suggestions"
                      placeholder="Gắn nhãn..."
                      style={{ width: 110, fontSize: ".8rem", padding: "6px 8px" }}
                    />
                    <button className="btn btn-sm btn-outline" type="submit">
                      Lưu
                    </button>
                  </form>
                </td>
                <td>
                  <span className={`status-badge status-${lead.status}`}>{lead.status}</span>
                </td>
                <td style={{ display: "flex", gap: 6 }}>
                  {lead.status !== "CONTACTED" && (
                    <form action={updateLeadStatusAction.bind(null, lead.id, "CONTACTED")}>
                      <button className="btn btn-sm btn-outline" type="submit">
                        Đã liên hệ
                      </button>
                    </form>
                  )}
                  {lead.status !== "CLOSED" && (
                    <form action={updateLeadStatusAction.bind(null, lead.id, "CLOSED")}>
                      <button className="btn btn-sm btn-outline" type="submit">
                        Đóng
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", color: "var(--a-ink-soft)" }}>
                  Chưa có yêu cầu nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <datalist id="tag-suggestions">
        {TAG_SUGGESTIONS.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>
    </>
  );
}
