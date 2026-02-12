import React from "react";
import { Suspense } from "react";
import ShopContent from "@/components/ShopContent.js";
import { fetchProdAndCat } from "@/actions/dbactions";

export default async function Shop() {
  const { products, categories } = await fetchProdAndCat();

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center font-black text-[#253D4E]">
          Loading Quickzy Shop...
        </div>
      }
    >
      <ShopContent products={products} categories={categories} />
    </Suspense>
  );
}
