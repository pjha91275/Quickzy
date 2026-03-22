import React, { Suspense } from "react";
import { fetchAllData } from "@/actions/dbactions";
import HomeContent from "@/components/HomeContent";

export default async function Home() {
  const data = await fetchAllData();
  const { Product, Category, BlogPost, Banner } = data;

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
      <HomeContent 
        products={Product} 
        categories={Category} 
        banners_db={Banner} 
        blogPosts_db={BlogPost} 
      />
    </Suspense>
  );
}

