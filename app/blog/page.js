"use client";
import React from "react";
import Link from "next/link";
import { FiClock, FiUser, FiArrowRight, FiTag } from "react-icons/fi";

const blogs = [
  {
    id: 1,
    title: "How to Keep Your Leafy Greens Fresh for a Week",
    category: "Fresh Produce",
    author: "Chef Anita",
    date: "March 12, 2026",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2070",
    excerpt: "Learn the secret techniques to maintain that crisp crunch in your spinach and kale even days after delivery.",
  },
  {
    id: 2,
    title: "10-Minute Breakfast Ideas Using Quickzy Pantry Essentials",
    category: "Quick Recipes",
    author: "Rahul Varma",
    date: "March 10, 2026",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0aef066?q=80&w=2070",
    excerpt: "Mornings can be a rush. Here are 5 delicious and healthy breakfast recipes you can whip up using items from our app.",
  },
  {
    id: 3,
    title: "The Future of Quick Commerce: Why Speed Matters",
    category: "Insider",
    author: "Pranay J.",
    date: "March 08, 2026",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=2070",
    excerpt: "Exploring how hyper-local delivery is changing the way we shop and the technology behind 10-minute deliveries.",
  },
  {
    id: 4,
    title: "Managing Home Care on a Budget: Pro Tips",
    category: "Household",
    author: "Sarah Mendis",
    date: "March 05, 2026",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070",
    excerpt: "Save money and keep your home sparkling with these clever cleaning hacks using basic household supplies.",
  },
];

const BlogPage = () => {
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
          {blogs.map((blog) => (
            <div key={blog.id} className="border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
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
                <Link href={`/blog/${blog.id}`} className="mt-auto text-[#3BB77E] text-xs font-black uppercase flex items-center gap-2">
                  Read More <FiArrowRight />
                </Link>
              </div>
            </div>
          ))}
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
};

export default BlogPage;
