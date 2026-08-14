import { prisma } from "@/lib/db";
import { approveReviewAction, rejectReviewAction, deleteReviewAction } from "@/lib/actions/admin-reviews";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;

  return (
    <>
      <div className="admin-topbar">
        <h1>Đánh giá sản phẩm ({reviews.length})</h1>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="admin-stat">
          <b>{pendingCount}</b>
          <span>Chờ duyệt</span>
        </div>
        <div className="admin-stat">
          <b>{reviews.filter((r) => r.status === "APPROVED").length}</b>
          <span>Đã duyệt (hiển thị công khai)</span>
        </div>
        <div className="admin-stat">
          <b>{reviews.filter((r) => r.status === "REJECTED").length}</b>
          <span>Đã từ chối</span>
        </div>
      </div>

      <div className="admin-panel">
        {reviews.length === 0 ? (
          <p style={{ color: "var(--a-ink-soft)", margin: 0 }}>Chưa có đánh giá nào từ khách hàng.</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ borderBottom: "1px solid var(--a-line)", paddingBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <span className={`status-badge status-${r.status === "PENDING" ? "NEW" : r.status === "APPROVED" ? "CONTACTED" : "CLOSED"}`}>
                      {r.status === "PENDING" ? "Chờ duyệt" : r.status === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}
                    </span>{" "}
                    <b style={{ marginLeft: 6 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</b>
                    <div style={{ fontSize: ".85rem", color: "var(--a-ink-soft)", marginTop: 4 }}>
                      Sản phẩm: <b>{r.product.name}</b> · {r.customerName} · {formatDate(r.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {r.status !== "APPROVED" && (
                      <form action={approveReviewAction.bind(null, r.id)}>
                        <button className="btn btn-sm btn-primary" type="submit">Duyệt</button>
                      </form>
                    )}
                    {r.status !== "REJECTED" && (
                      <form action={rejectReviewAction.bind(null, r.id)}>
                        <button className="btn btn-sm btn-outline" type="submit">Từ chối</button>
                      </form>
                    )}
                    <form action={deleteReviewAction.bind(null, r.id)}>
                      <button className="btn btn-sm btn-danger" type="submit">Xoá</button>
                    </form>
                  </div>
                </div>
                {r.title && <h4 style={{ margin: "10px 0 2px" }}>{r.title}</h4>}
                <p style={{ margin: "4px 0 0", color: "var(--a-ink)" }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
