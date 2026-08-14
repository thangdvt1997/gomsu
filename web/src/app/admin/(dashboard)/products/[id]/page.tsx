import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateProductAction, deleteProductAction, deleteProductImageAction } from "@/lib/actions/admin-products";
import { uploadProductImageAction } from "@/lib/actions/admin-upload";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, glazes] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        sizes: { orderBy: { sortOrder: "asc" } },
        colors: { include: { glaze: true }, orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.glaze.findMany({ orderBy: { label: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <>
      <div className="admin-topbar">
        <h1>Sửa: {product.name}</h1>
        <form action={deleteProductAction.bind(null, product.id)}>
          <button className="btn btn-danger" type="submit">
            Xoá sản phẩm
          </button>
        </form>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Hình ảnh</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          {product.images.map((img) => (
            <div key={img.id} style={{ position: "relative" }}>
              <img src={img.thumbUrl ?? img.url} alt="" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }} />
              {img.isBorrowed && (
                <span className="status-badge status-CLOSED" style={{ position: "absolute", top: 4, left: 4 }}>
                  Minh hoạ
                </span>
              )}
              <form action={deleteProductImageAction.bind(null, product.id, img.id)}>
                <button className="btn btn-sm btn-danger" type="submit" style={{ width: "100%", marginTop: 4 }}>
                  Xoá
                </button>
              </form>
            </div>
          ))}
        </div>
        <form action={uploadProductImageAction.bind(null, product.id)} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="file" name="file" accept="image/*" required />
          <button className="btn btn-outline" type="submit">
            Tải ảnh lên
          </button>
        </form>
      </div>

      <ProductForm
        action={updateProductAction.bind(null, product.id)}
        categories={categories}
        glazes={glazes}
        product={product}
        submitLabel="Lưu thay đổi"
      />
    </>
  );
}
