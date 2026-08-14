"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard,
  IconBox,
  IconTag,
  IconPalette,
  IconFileText,
  IconCart,
  IconMessage,
  IconStar,
  IconPercent,
  IconSearch,
  IconSettings,
} from "@/components/admin/AdminIcons";

type NavItem = { href: string; label: string; icon: (props: { size?: number }) => React.ReactElement };
type NavGroup = { label: string | null; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [{ href: "/admin", label: "Tổng quan", icon: IconDashboard }],
  },
  {
    label: "Bán hàng",
    items: [
      { href: "/admin/orders", label: "Đơn hàng", icon: IconCart },
      { href: "/admin/leads", label: "Liên hệ / Báo giá", icon: IconMessage },
      { href: "/admin/coupons", label: "Mã giảm giá", icon: IconPercent },
      { href: "/admin/reviews", label: "Đánh giá", icon: IconStar },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { href: "/admin/products", label: "Sản phẩm", icon: IconBox },
      { href: "/admin/categories", label: "Danh mục", icon: IconTag },
      { href: "/admin/glaze", label: "Tông men", icon: IconPalette },
      { href: "/admin/posts", label: "Bài viết", icon: IconFileText },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { href: "/admin/seo", label: "SEO", icon: IconSearch },
      { href: "/admin/settings", label: "Cài đặt", icon: IconSettings },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav">
      {NAV_GROUPS.map((group, gi) => (
        <div className="admin-nav-group" key={group.label ?? `g${gi}`}>
          {group.label && <div className="admin-nav-label">{group.label}</div>}
          {group.items.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
