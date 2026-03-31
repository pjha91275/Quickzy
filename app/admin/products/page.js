import { getProductsAdmin, getCategoriesAdmin } from "@/actions/adminactions";
import ProductsListContent from "@/components/ProductsListContent";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProductsAdmin(),
    getCategoriesAdmin(),
  ]);

  return (
    <ProductsListContent initialProducts={products} categories={categories} />
  );
}
