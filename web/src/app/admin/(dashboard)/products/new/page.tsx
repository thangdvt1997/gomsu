import { prisma } from "@/lib/db";
import { createProductAction } from "@/lib/actions/admin-products";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminBackLink } from "@/components/admin/AdminBackLink";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, glazes] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.glaze.findMany({ orderBy: { label: "asc" } }),
  ]);

  return (
    <>
      <AdminBackLink href="/admin/products" label="Quay lại danh sách sản phẩm" />
      <div className="admin-topbar">
        <h1>Thêm sản phẩm</h1>
      </div>
      <ProductForm action={createProductAction} categories={categories} glazes={glazes} submitLabel="Tạo sản phẩm" />
    </>
  );
}
