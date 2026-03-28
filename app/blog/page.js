import React from "react";
import Link from "next/link";
import { FiClock, FiUser, FiArrowRight } from "react-icons/fi";
import { fetchBlogPosts } from "@/actions/dbactions";

export default async function BlogPage() {
  const blogs = await fetchBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-green-50/50 py-16 text-center border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-[#253D4E] mb-3">
            Quickzy <span className="text-[#3BB77E]">Stories</span>
          </h1>
          <p className="text-gray-500 font-bold max-w-xl mx-auto text-sm">
            Latest updates, recipes, and tech trends from the world of speed.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id || blog.id} className="border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                <div className="h-52 relative overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-[10px] font-black text-[#3BB77E] uppercase shadow-sm">
                    {blog.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="flex gap-4 text-gray-400 text-[10px] font-black uppercase mb-3">
                    <span className="flex items-center gap-1"><FiClock /> {blog.date}</span>
                    <span className="flex items-center gap-1"><FiUser /> {blog.author}</span>
                  </div>
                  <h3 className="text-xl font-black text-[#253D4E] mb-3 line-clamp-2 leading-tight">{blog.title}</h3>
                  <p className="text-gray-500 text-sm mb-5 line-clamp-2">{blog.excerpt}</p>
                  <Link href={`/blog/${blog._id}`} className="mt-auto text-[#3BB77E] text-xs font-black uppercase flex items-center gap-2">
                    Read More <FiArrowRight />
                  </Link>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-full text-center py-20 text-gray-400 font-bold">No stories found yet.</div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-20 container mx-auto px-4">
        <div className="bg-[#253D4E] rounded-[32px] p-12 text-center text-white">
          <h2 className="text-3xl font-black mb-4">Join our Newsletter</h2>
          <p className="text-gray-400 text-xs font-bold mb-8 uppercase tracking-widest">Weekly recipes and fresh commerce trends.</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="Email Address" className="flex-1 bg-white/10 rounded-xl px-6 py-3 outline-none focus:ring-2 ring-[#3BB77E] font-bold" />
            <button className="bg-[#3BB77E] px-8 py-3 rounded-xl font-black hover:bg-[#29A56C] transition-all">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
