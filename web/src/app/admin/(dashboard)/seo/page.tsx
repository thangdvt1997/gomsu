import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

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

export default async function AdminSeoPage() {
  const [products, posts] = await Promise.all([
    prisma.product.findMany({
      where: { isDraft: false },
      select: { name: true, slug: true, metaTitle: true, metaDescription: true },
    }),
    prisma.post.findMany({
      select: { title: true, slug: true, metaTitle: true, metaDescription: true },
    }),
  ]);

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
