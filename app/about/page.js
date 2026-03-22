"use client";
import React from "react";
import { FiCheckCircle, FiZap, FiTruck, FiShield, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Immersive & Premium */}
      <section className="relative h-[500px] flex items-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dnafzpa8x/image/upload/v1773944030/quickzy/banners/hero-banner-2.jpg" 
            alt="Quickzy Background" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
            <h6 className="text-[#3BB77E] font-black uppercase tracking-[0.3em] text-[10px] mb-4">India's Fastest Zap Commerce</h6>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Delivering <span className="text-[#3BB77E]">Happiness</span> <br />
              Within 15 Mins.
            </h1>
            <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-lg mb-5">
              At Quickzy, we are redefining the limits of quick commerce by bringing your neighborhood store directly to your doorstep with unmatched speed and care.
            </p>
            <div className="flex gap-4">
               <Link href="/shop" className="bg-[#3BB77E] text-white px-8 py-4 rounded-2xl font-black hover:bg-white hover:text-[#253D4E] transition-all flex items-center gap-2 group">
                  Start Shopping <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Clean Grid */}
      <section className="relative mt-4 container mx-auto px-4 z-20 max-w-6xl">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-300 p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { val: "10M+", label: "Orders Monthly" },
              { val: "500+", label: "Dark Stores" },
              { val: "99.9%", label: "Ontime Delivery" },
              { val: "24/7", label: "Expert Support" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                 <div className="text-3xl md:text-4xl font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors mb-1">{stat.val}</div>
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-15 container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-block bg-[#DEF9EC] text-[#3BB77E] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                 Our Philosophy
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#253D4E] leading-tight tracking-tight">
                 We're not just fast, <br />
                 We're <span className="text-[#3BB77E]">Reliable.</span>
              </h2>
              <div className="space-y-4 text-gray-500 font-medium leading-relaxed text-base">
                 <p>
                    Quickzy was founded in 2026 with a singular vision: to eliminate the friction in daily life. We realized that hours are wasted every week in traffic or queues for simple grocery runs.
                 </p>
                 <p>
                    By leveraging hyper-local dark stores and a proprietary AI-routing engine, we ensure that your milk, bread, or even a new smartwatch reaches you before you've finished your cup of coffee.
                 </p>
              </div>
              <ul className="space-y-4 pt-4">
                 {[
                   "Zero-compromise on product freshness",
                   "Ethical sourcing from local farm partners",
                   "No-plastic eco-delivery initiative"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 font-black text-[#253D4E] text-sm">
                      <div className="w-5 h-5 bg-[#3BB77E] rounded-full flex items-center justify-center text-white shrink-0">
                         <FiCheckCircle size={12} />
                      </div>
                      {item}
                   </li>
                 ))}
              </ul>
           </div>

           <div className="relative">
              <div className="absolute -inset-4 bg-[#DEF9EC] rounded-[60px] -rotate-3 z-0"></div>
              <div className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl border-8 border-white group">
                 <img 
                   src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=2070" 
                   alt="Quickzy Hub" 
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                 />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[32px] shadow-2xl z-20 hidden md:flex items-center gap-4 animate-bounce duration-[3000ms]">
                 <div className="w-16 h-16 bg-[#3BB77E] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                    <FiZap size={30} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zap Delivery</p>
                    <p className="text-xl font-black text-[#253D4E]">Avg. 9m 42s</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-slate-50 py-24 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black text-[#253D4E]">Why the World Loves Quickzy</h2>
              <p className="text-gray-500 font-bold max-w-xl mx-auto uppercase tracking-widest text-[10px]">
                 Built on trust, speed, and community.
              </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <FiZap />, 
                  title: "Zap Logistics", 
                  desc: "Our dark stores are strategically placed across Mumbai to ensure rapid, last-mile fulfillment.",
                  color: "bg-[#3BB77E] group-hover:bg-[#253D4E]"
                },
                { 
                  icon: <FiShield />, 
                  title: "Pure Quality", 
                  desc: "We hand-check every item. If it's not Grade-A, it doesn't leave our fulfillment center.",
                  color: "bg-[#3BB77E] group-hover:bg-[#253D4E]"
                },
                { 
                  icon: <FiTruck />, 
                  title: "Zero Emission", 
                  desc: "Our EV-first fleet reduces the carbon footprint while ensuring your groceries stay fresh.",
                  color: "bg-[#3BB77E] group-hover:bg-[#253D4E]"
                }
              ].map((val, i) => (
                <div key={i} className="flex flex-col items-center text-center md:items-start md:text-left bg-white p-10 rounded-[40px] border border-transparent hover:border-[#DEF9EC] hover:shadow-2xl transition-all duration-500 group">
                   <div className={`w-16 h-16 ${val.color} text-white rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0 shadow-lg shadow-green-100 transition-all duration-300`}>
                      {React.cloneElement(val.icon, { size: 28 })}
                   </div>
                   <h4 className="text-xl font-black text-[#253D4E] mb-4 tracking-tight">{val.title}</h4>
                   <p className="text-gray-500 font-medium leading-relaxed text-sm">{val.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
