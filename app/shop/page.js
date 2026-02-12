import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  FiShoppingCart,
  FiSearch,
  FiGrid,
  FiList,
  FiFilter,
  FiChevronRight,
  FiX,
  FiStar,
} from "react-icons/fi";
import connectDb from "@/db/connectDb.js";
import Product from "@/models/Product.js";
import Category from "@/models/Category.js";

async function fetchFromDB() {
  await connectDb();
  const products = await Product.find({});
  const categories = await Category.find({});

  return { products, categories };
}


// ARCHITECTURE GUIDE:
// 1. To make this work, REMOVE "use client" from the top of this file.
// 2. Move the entire 'ShopContent' component to a new file: '@/components/ShopContent.js' (and put "use client" there).
// 3. Update the 'Shop' function below to be 'async'.

export default async function Shop() {
  // 4. Call the fetch function here (Server-side)
  // const { products, categories } = await fetchFromDB();

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center font-black text-[#253D4E]">
          Loading Quickzy Shop...
        </div>
      }
    >
      {/* 5. Pass the live data down to your Client Component as props */}
      <ShopContent products={products} categories={categories}/>
    </Suspense>
  );
}

// SHARED DATA GUIDE:
// To use this data on other pages (like the Homepage):
// Do NOT export data from this file. Move the 'fetchFromDB' function
// into 'db/actions.js'. Then, in any other page component:
// import { fetchFromDB } from "@/db/actions";
// const { products } = await fetchFromDB();
