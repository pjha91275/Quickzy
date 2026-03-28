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
               <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-2xl font-black transition-colors">
                  <FiArrowLeft /> Back to Stories
               </Link>
               <div className="flex gap-3 mb-2">
                  <span className="bg-[#3BB77E] text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-green-900/40">
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
               <p className="text-xl md:text-2xl font-black text-[#253D4E] mb-10 leading-snug border-l-4 border-[#3BB77E] pl-6 italic">
                  {post.excerpt}
               </p>
               
               <div className="whitespace-pre-wrap space-y-8 text-[#253D4E]/80">
                  {post.content || "Experience the ultimate speed and freshness with Quickzy's latest insights. Our team is working hard to bring you the full depth of this story. Stay tuned for expert advice, detailed recipes, and the latest trends in instant delivery."}
               </div>

               {/* Section 2: Pro Insights */}
               <div className="mt-16 bg-[#F7F8FD] rounded-[32px] p-8 md:p-12 border border-blue-50">
                  <h3 className="text-2xl font-black text-[#253D4E] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-[#3BB77E] text-white rounded-lg flex items-center justify-center text-sm">!</span>
                    Quickzy Expert Insights
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-black text-[#3BB77E] uppercase text-xs tracking-widest">The Secret Sauce</h4>
                      <p className="text-sm font-medium leading-relaxed">Consistency is key when it comes to maintaining quality. At Quickzy, we prioritize sourcing from vendors who share our commitment to rapid fulfillment and grade-A quality across all categories.</p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-black text-[#3BB77E] uppercase text-xs tracking-widest">Flash Fulfillment</h4>
                      <p className="text-sm font-medium leading-relaxed">Our 15-minute promise isn't just a goal; it's a standard. By optimizing our delivery paths and using decentralized dark stores, we ensure your favorites reach you at the peak of freshness.</p>
                    </div>
                  </div>
               </div>

               {/* Section 3: Key Learnings */}
               <div className="mt-16 space-y-8">
                  <h3 className="text-2xl font-black text-[#253D4E]">What You'll Take Away</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Understanding the logistics of speed",
                      "Maintaining freshness during delivery",
                      "How AI optimizes your shopping paths",
                      "The future of instant commerce"
                    ].map((tip, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:border-[#3BB77E] transition-colors">
                        <span className="text-[#3BB77E] font-black text-xl">0{i+1}</span>
                        <span className="text-sm font-black text-[#253D4E]">{tip}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Footer Sign-off */}
            <div className="mt-20 pt-10 border-t border-gray-100">
               <div className="bg-[#DEF9EC] rounded-[32px] p-10 flex flex-col md:flex-row items-center gap-10 justify-between relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black text-[#253D4E] mb-3 tracking-tight">Enjoyed this Story?</h4>
                    <p className="text-gray-600 text-sm font-medium max-w-sm">There's plenty more where that came from. Explore our full library of insights and master the art of quick living.</p>
                  </div>
                  <Link href="/blog" className="relative z-10 bg-[#3BB77E] text-white px-10 py-5 rounded-2xl font-black hover:bg-[#29A56C] transition-all shadow-xl shadow-green-200 active:scale-95 whitespace-nowrap">
                    Discover More Stories
                  </Link>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#3BB77E]/10 rounded-full blur-3xl"></div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
