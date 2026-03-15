"use client";
import React from "react";
import { FiCheckCircle, FiZap, FiTruck, FiShield, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070" 
          alt="Quickzy Groceries" 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            About <span className="text-[#3BB77E]">Quickzy</span>
          </h1>
          <p className="text-gray-200 font-bold max-w-xl mx-auto uppercase tracking-widest text-xs md:text-sm">
            Revolutionizing the way you shop for daily essentials.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "10 min", label: "Zap Delivery" },
              { val: "50k+", label: "Happy Users" },
              { val: "100+", label: "Local Stores" },
              { val: "24/7", label: "Premium Support" }
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-2xl md:text-3xl font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors">{stat.val}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Features */}
      <section className="py-20 container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#253D4E] mb-4">Our Core Mission</h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            We believe you shouldn't have to wait for your daily necessities. Quickzy is built on the promise of speed, quality, and community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <FiZap />, title: "Zap Delivery", desc: "Our lightning-fast logistics network ensures your order reaches you in under 10 minutes.", color: "bg-amber-50 text-amber-500 border-amber-100" },
            { icon: <FiCheckCircle />, title: "Grade A Quality", desc: "Every product is handpicked and quality-checked before it leaves our local hubs.", color: "bg-green-50 text-[#3BB77E] border-green-100" },
            { icon: <FiShield />, title: "Local Partners", desc: "We empower local vendors and neighborhood stores to grow with our hyper-local platform.", color: "bg-blue-50 text-blue-500 border-blue-100" },
            { icon: <FiTruck />, title: "Sustainability", desc: "Optimized route planning and eco-friendly packaging lead our way to a greener future.", color: "bg-purple-50 text-purple-500 border-purple-100" }
          ].map((feat, i) => (
            <div key={i} className={`p-8 rounded-3xl border-2 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center ${feat.color}`}>
              <div className="text-3xl mb-4">{feat.icon}</div>
              <h4 className="text-lg font-black text-[#253D4E] mb-3">{feat.title}</h4>
              <p className="text-xs font-bold leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-[40px] overflow-hidden shadow-2xl bg-white border-8 border-white group">
            <img 
              src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=2070" 
              alt="Quickzy Delivery" 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
            />
          </div>
          <div className="space-y-6">
            <h6 className="text-[#3BB77E] font-black uppercase tracking-widest text-xs">Our Journey</h6>
            <h2 className="text-4xl font-black text-[#253D4E] leading-tight">Starting a Fresh <span className="text-green-200">Revolution.</span></h2>
            <p className="text-gray-600 font-medium leading-relaxed">
              Quickzy was born from a simple observation: time is the most valuable commodity. We started in a small garage with a big vision: to bring the neighborhood store to your phone, but faster than you can walk there.
            </p>
            <p className="text-gray-600 font-medium leading-relaxed">
              Today, we are proud to serve thousands of families, providing not just groceries, but the freedom to spend time on what truly matters.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="bg-[#3BB77E] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#29A56C] transition-all flex items-center gap-2 w-fit shadow-lg shadow-green-100">
                Contact Our Team <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
