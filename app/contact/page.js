"use client";
import React from "react";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Enquiry received! We'll reach out to you very soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong. Please try again later.");
      }
    } catch (error) {
       toast.error("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Header */}
      <section className="bg-white py-20 border-b text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#DEF9EC]/20 -skew-y-3 origin-top-left"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h6 className="text-[#3BB77E] font-black uppercase tracking-[0.3em] text-[10px] mb-4">Support & Feedback</h6>
          <h1 className="text-5xl font-black text-[#253D4E] mb-4 tracking-tight">Get in <span className="text-[#3BB77E]">Touch</span></h1>
          <p className="text-gray-400 font-bold max-w-xl mx-auto text-sm leading-relaxed">
            Have a question about your order or our service? Our zap team is available 24/7 to assist you with lightning speed.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex-1">
              <h3 className="text-lg font-black text-[#253D4E] border-b pb-6 border-gray-100 mb-8 uppercase tracking-widest">Quick Contact</h3>
              <div className="space-y-6">
                {[
                   { icon: <FiPhone />, label: "Emergency Helpline", val: <a href="tel:+911800419123" className="hover:text-[#3BB77E] transition-colors relative z-10 font-black">+91 1800-419-123</a> },
                   { icon: <FiMail />, label: "Support Email", val: <a href="mailto:shopquickzy@gmail.com?subject=Quickzy Support Inquiry" className="hover:text-[#3BB77E] transition-colors relative z-10 font-black">shopquickzy@gmail.com</a> },
                   { icon: <FiClock />, label: "Hours of Service", val: <span className="font-bold text-gray-400">24/7 Premium Support</span> },
                   { icon: <FiMapPin />, label: "Head Office", val: <span className="font-bold text-gray-400">Worli, Mumbai</span> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="w-12 h-12 rounded-xl bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] text-lg shrink-0 group-hover:bg-[#3BB77E] group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</h4>
                      <p className="font-bold text-[#253D4E] text-sm leading-tight">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#253D4E] rounded-3xl p-8 text-white relative overflow-hidden group shrink-0 shadow-lg">
               <h4 className="text-lg font-black mb-2 relative z-10">Follow Our Journey</h4>
               <p className="text-gray-400 text-xs mb-6 relative z-10 font-bold">Join 50k+ users getting daily updates.</p>
               <div className="flex gap-3 relative z-10">
                  {['IG', 'TW', 'FB'].map(s => (
                    <div key={s} className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center text-[10px] font-black hover:bg-[#3BB77E] hover:border-transparent transition-all cursor-pointer">{s}</div>
                  ))}
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-2xl">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-[#253D4E] mb-3">Drop us a Line</h2>
              <div className="w-16 h-1.5 bg-[#3BB77E] rounded-full mx-auto lg:mx-0"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {[
                { name: "name", label: "Full Name", placeholder: "John Doe", type: "text" },
                { name: "email", label: "Email Address", placeholder: "john@example.com", type: "email" },
                { name: "subject", label: "Subject", placeholder: "e.g., Order Update", type: "text", colSpan: true }
              ].map(f => (
                <div key={f.name} className={`flex flex-col gap-1.5 ${f.colSpan ? 'md:col-span-2' : ''}`}>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">{f.label}</label>
                  <input type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange} placeholder={f.placeholder} required className="bg-slate-50 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:ring-4 ring-green-100/50 font-bold text-sm border border-transparent focus:border-[#3BB77E]/20 transition-all shadow-inner" />
                </div>
              ))}
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write here..." required className="bg-slate-50 rounded-xl px-4 py-4 outline-none focus:bg-white focus:ring-4 ring-green-100/50 font-bold text-sm border border-transparent focus:border-[#3BB77E]/20 transition-all shadow-inner resize-none min-h-[160px]" />
              </div>
              <div className="md:col-span-2 pt-4">
                <button disabled={loading} className="w-full bg-[#3BB77E] text-white py-4 rounded-xl font-black text-lg hover:bg-[#253D4E] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? "Sending..." : <>Send Message <FiSend /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
