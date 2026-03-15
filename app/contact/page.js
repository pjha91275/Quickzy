"use client";
import React from "react";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly.");
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 py-16 border-b text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black text-[#253D4E] mb-3">Get in Touch</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            We're here to help with your orders or services.
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: <FiPhone />, label: "Call Us", val: "+91 1800-419-123", color: "bg-green-50 text-[#3BB77E]" },
              { icon: <FiMail />, label: "Email", val: "support@quickzy.com", color: "bg-blue-50 text-blue-500" },
              { icon: <FiMapPin />, label: "Headquarters", val: "Udyog Vihar, Gurgaon", color: "bg-red-50 text-red-500" },
              { icon: <FiClock />, label: "Operational", val: "24/7 Service", color: "bg-amber-50 text-amber-500" }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</h4>
                  <p className="font-black text-[#253D4E]">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
            <h2 className="text-2xl font-black text-[#253D4E] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Full Name</label>
                <input type="text" placeholder="John Doe" required className="bg-gray-50 rounded-xl px-5 py-3 outline-none focus:ring-2 ring-green-100 font-bold text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Email Address</label>
                <input type="email" placeholder="john@example.com" required className="bg-gray-50 rounded-xl px-5 py-3 outline-none focus:ring-2 ring-green-100 font-bold text-sm" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Subject</label>
                <input type="text" placeholder="Order Inquiry" required className="bg-gray-50 rounded-xl px-5 py-3 outline-none focus:ring-2 ring-green-100 font-bold text-sm" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Message</label>
                <textarea placeholder="How can we help?" rows={4} required className="bg-gray-50 rounded-xl px-5 py-3 outline-none focus:ring-2 ring-green-100 font-bold text-sm resize-none" />
              </div>
              <button className="bg-[#3BB77E] text-white py-4 rounded-xl font-black hover:bg-[#29A56C] transition-all flex items-center justify-center gap-2 mt-2">
                Send Message <FiSend />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
