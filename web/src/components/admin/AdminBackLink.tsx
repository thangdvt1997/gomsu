import Link from "next/link";
import { IconArrowLeft } from "@/components/admin/AdminIcons";

export function AdminBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="admin-back-link">
      <IconArrowLeft size={15} />
      {label}
    </Link>
  );
}
