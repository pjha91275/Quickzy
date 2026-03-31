export const dynamic = "force-dynamic";
import React from "react";
import { getProductsAdmin } from "@/actions/adminactions";
import ProductsListContent from "@/components/ProductsListContent";

export default async function ProductsPage() {
  const products = await getProductsAdmin();

  return (
    <ProductsListContent initialProducts={products} />
  );
}
