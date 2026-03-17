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
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 stretch">
          {/* Contact Info */}
          <div className="lg:col-span-4 flex flex-col gap-8 h-full">
            <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 flex-1">
              <h3 className="text-xl font-black text-[#253D4E] border-b pb-6 border-gray-100 mb-8">Quick Contact Info</h3>
              <div className="space-y-8 flex flex-col justify-between h-auto">
                {[
                  { icon: <FiPhone />, label: "Emergency Helpline", val: "+91 1800-419-123" },
                  { icon: <FiMail />, label: "Support Email", val: "support@quickzy.com" },
                  { icon: <FiClock />, label: "Hours of Service", val: "24/7 Premium Support" },
                  { icon: <FiMapPin />, label: "Head Office", val: "Worli, Mumbai, Maharashtra" },
                  { icon: <FiMapPin />, label: "Delivery Hub", val: "Andheri East, Mumbai" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-center group">
                    <div className="w-14 h-14 rounded-[20px] bg-[#DEF9EC]/50 flex items-center justify-center text-[#3BB77E] text-xl shrink-0 border border-[#3BB77E]/10 group-hover:bg-[#3BB77E] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#3BB77E]/30 transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</h4>
                      <p className="font-black text-[#253D4E] text-[14px] leading-tight break-words">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#253D4E] rounded-[40px] p-10 text-white relative overflow-hidden group shrink-0">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <h4 className="text-xl font-black mb-3 relative z-10">Follow Our Journey</h4>
               <p className="text-gray-400 text-sm mb-8 relative z-10 font-bold">Join 50k+ users geting daily updates.</p>
               <div className="flex gap-4 relative z-10">
                  {['IG', 'TW', 'FB'].map(s => (
                    <div key={s} className="w-12 h-12 border-2 border-white/10 rounded-2xl flex items-center justify-center text-[11px] font-black hover:bg-[#3BB77E] hover:border-[#3BB77E] transition-all cursor-pointer shadow-lg">{s}</div>
                  ))}
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8 bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col h-full">
            <div className="mb-10 shrink-0">
              <h2 className="text-4xl font-black text-[#253D4E] mb-3">Drop us a Line</h2>
              <div className="w-16 h-2 bg-[#3BB77E] rounded-full"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 flex-1 h-full">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  required 
                  className="bg-slate-50 rounded-3xl px-6 py-5 outline-none focus:bg-white focus:ring-4 ring-green-100/50 font-bold text-[15px] border border-transparent focus:border-[#3BB77E]/20 transition-all shadow-inner" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com" 
                  required 
                  className="bg-slate-50 rounded-3xl px-6 py-5 outline-none focus:bg-white focus:ring-4 ring-green-100/50 font-bold text-[15px] border border-transparent focus:border-[#3BB77E]/20 transition-all shadow-inner" 
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Subject of Inquiry</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Order #9283 - Delivery Update" 
                  required 
                  className="bg-slate-50 rounded-3xl px-6 py-5 outline-none focus:bg-white focus:ring-4 ring-green-100/50 font-bold text-[15px] border border-transparent focus:border-[#3BB77E]/20 transition-all shadow-inner" 
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2 flex-grow">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Detailed Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..." 
                  required 
                  className="bg-slate-50 rounded-3xl px-6 py-5 outline-none focus:bg-white focus:ring-4 ring-green-100/50 font-bold text-[15px] border border-transparent focus:border-[#3BB77E]/20 transition-all shadow-inner resize-none flex-grow h-full min-h-[250px]" 
                />
              </div>
              <div className="md:col-span-2 pt-4">
                <button 
                  disabled={loading}
                  className="group w-full bg-[#3BB77E] text-white py-6 rounded-3xl font-black text-xl hover:bg-[#253D4E] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-green-100 hover:shadow-gray-200 active:scale-[0.98]"
                >
                  {loading ? (
                    "Sending Message..."
                  ) : (
                    <>
                      Send Your Message <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
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
