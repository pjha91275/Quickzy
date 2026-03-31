import React from "react";
export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import ShopContent from "@/components/ShopContent.js";
import { fetchProdAndCat } from "@/actions/dbactions";

export default async function Shop({ searchParams }) {
  // Ensure we track searchParams to trigger fresh re-fetching on navigation
  const params = await searchParams;
  const { products, categories } = await fetchProdAndCat();

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center font-black text-[#253D4E]">
          Loading Quickzy Shop...
        </div>
      }
    >
      <ShopContent products={products} categories={categories} searchParams={params} />
    </Suspense>
  );
}
