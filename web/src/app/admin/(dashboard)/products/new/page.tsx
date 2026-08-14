import { prisma } from "@/lib/db";
import { createProductAction } from "@/lib/actions/admin-products";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, glazes] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.glaze.findMany({ orderBy: { label: "asc" } }),
  ]);

  return (
    <>
      <div className="admin-topbar">
        <h1>Thêm sản phẩm</h1>
      </div>
      <ProductForm action={createProductAction} categories={categories} glazes={glazes} submitLabel="Tạo sản phẩm" />
    </>
  );
}
