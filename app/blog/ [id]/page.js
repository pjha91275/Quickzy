import React from "react";
import { fetchBlogPostById } from "@/actions/dbactions";
import { notFound } from "next/navigation";
import { FiClock, FiUser, FiArrowLeft, FiTag } from "react-icons/fi";
import Link from "next/link";

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = await fetchBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Decorative Hero Background */}
      <div className="h-[40vh] md:h-[50vh] relative overflow-hidden group">
         <img 
           src={post.image} 
           alt={post.title} 
           className="w-full h-full object-cover brightness-75 scale-100 group-hover:scale-105 transition-transform duration-1000"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
         <div className="absolute bottom-10 left-0 w-full">
            <div className="container mx-auto px-4 max-w-4xl">
               <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-black transition-colors">
                  <FiArrowLeft /> Back to Stories
               </Link>
               <div className="flex gap-3 mb-4">
                  <span className="bg-[#3BB77E] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-900/40">
                    {post.category}
                  </span>
               </div>
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-xl">
                  {post.title}
               </h1>
            </div>
         </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10">
         <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-8 md:p-16 border border-gray-100">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-gray-100 mb-10">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <FiUser />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Written By</p>
                        <p className="text-sm font-black text-[#253D4E]">{post.author}</p>
                     </div>
                  </div>
                  <div className="hidden sm:block h-8 w-[1px] bg-gray-100"></div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <FiClock />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Published On</p>
                        <p className="text-sm font-black text-[#253D4E]">{post.date}</p>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl cursor-default">
                  <FiTag className="text-[#3BB77E]" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-tighter">{post.category} Selection</span>
               </div>
            </div>

            {/* Main Body */}
            <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed">
               {/* 
                 Split by double newline if it exists, or just render the text. 
                 Real production might use Markdown here.
               */}
               <p className="text-xl md:text-2xl font-bold text-[#253D4E] mb-8 leading-snug">
                  {post.excerpt}
               </p>
               
               <div className="whitespace-pre-wrap space-y-6">
                  {post.content || "Full article content coming soon..."}
               </div>
            </div>

            {/* Footer Sign-off */}
            <div className="mt-20 pt-10 border-t border-gray-100">
               <div className="bg-green-50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
                  <div>
                    <h4 className="text-xl font-black text-[#253D4E] mb-2 tracking-tight">Thanks for reading!</h4>
                    <p className="text-gray-500 text-sm font-medium">Keep discovering amazing recipes and insights with Quickzy.</p>
                  </div>
                  <Link href="/blog" className="bg-[#3BB77E] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#29A56C] transition-all shadow-lg hover:shadow-green-100 active:scale-95 whitespace-nowrap">
                    Discover More Stories
                  </Link>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
