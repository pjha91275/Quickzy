import React, { Suspense } from "react";
import { fetchProductById, fetchSimilarProducts } from "@/actions/dbactions";
import ProductContent from "@/components/ProductContent";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const product = await fetchProductById(id);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-200">
          <span className="text-4xl">🛒</span>
        </div>
        <h1 className="text-3xl font-black text-[#253D4E] mb-3">Product Unavailable</h1>
        <p className="text-gray-500 font-bold max-w-md mx-auto leading-relaxed mb-8">
          This item is currently out of stock or has been removed from our catalog. Check out our fresh items on the homepage!
        </p>
        <a href="/" className="bg-[#3BB77E] text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-green-100 hover:bg-[#29A56C] transition-all">
          Back to Shop
        </a>
      </div>
    );
  }

  const similarProducts = await fetchSimilarProducts(product.category, product.id_custom);

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center font-black text-[#253D4E] min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <img src="/logo.png" className="w-16 h-16 animate-bounce" alt="Loading..." />
            <p>Unpacking your product...</p>
          </div>
        </div>
      }
    >
      <ProductContent product={product} similarProducts={similarProducts} />
    </Suspense>
  );
}
