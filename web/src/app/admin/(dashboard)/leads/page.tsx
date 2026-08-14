import { prisma } from "@/lib/db";
import { updateLeadStatusAction } from "@/lib/actions/admin-leads";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  QUOTE_REQUEST: "Yêu cầu báo giá",
  CONTACT_MESSAGE: "Liên hệ chung",
};

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    include: { product: { select: { name: true, code: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Liên hệ &amp; Yêu cầu báo giá</h1>
      </div>
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Loại</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Nội dung</th>
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
                <td colSpan={7} style={{ textAlign: "center", color: "var(--a-ink-soft)" }}>
                  Chưa có yêu cầu nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
