import React, { Suspense } from "react";
import { fetchProdAndCat } from "@/actions/dbactions";
import HomeContent from "@/components/HomeContent";

export default async function Home() {
  const { products, categories } = await fetchProdAndCat();

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center font-black text-[#253D4E] min-h-screen flex items-center justify-center text-2xl">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/logo.png"
              className="w-16 h-16 animate-bounce"
              alt="Loading..."
            />
            <p>Gathering fresh essentials...</p>
          </div>
        </div>
      }
    >
      <HomeContent products={products} categories={categories} />
    </Suspense>
  );
}
