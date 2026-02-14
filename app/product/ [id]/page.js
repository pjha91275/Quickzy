import React, { Suspense } from "react";
import { fetchProductById, fetchSimilarProducts } from "@/actions/dbactions";
import ProductContent from "@/components/ProductContent";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const product = await fetchProductById(id);
  const similarProducts = product
    ? await fetchSimilarProducts(product.category, product.id_custom)
    : [];

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center font-black text-[#253D4E] min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/logo.png"
              className="w-16 h-16 animate-bounce"
              alt="Loading..."
            />
            <p>Unpacking your product...</p>
          </div>
        </div>
      }
    >
      <ProductContent product={product} similarProducts={similarProducts} />
    </Suspense>
  );
}
