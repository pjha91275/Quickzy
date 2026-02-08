"use client";
import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiX,
  FiPhone,
  FiArrowRight,
  FiNavigation,
  FiMapPin,
  FiHome,
  FiBriefcase,
} from "react-icons/fi";
import { signIn } from "next-auth/react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Location
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(null);

  // Lock scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Resend Timer logic
  React.useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // OTP Expiry Timer logic
  React.useEffect(() => {
    let interval;
    if (expiryTimer > 0) {
      interval = setInterval(() => {
        setExpiryTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiryTimer]);

  // OTP Expiry Logic - Wipes result so user can't verify an old code
  React.useEffect(() => {
    if (expiryTimer === 0) {
      setConfirmationResult(null);
      toast.error("Security Session Expired. Please request a new OTP.", {
        transition: Bounce,
      });
      setStep(1); // Force them back to start
    }
  }, [expiryTimer]);

  // --- QUICKZY LOCATION UI TODO ---
  // 1. STATE:
  //    - searchQuery: String (linked to the search input)
  //    - suggestions: Array (to store Mapbox API results)
  //    - selectedLocation: Object (to store {text, lat, lng} before saving)

  // 2. FUNCTIONS:
  //    - handleGetCurrentLocation:
  //        a. Use navigator.geolocation.getCurrentPosition().
  //        b. Fetch from `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${TOKEN}`
  //        c. Set the result to the address state.
  //    - handleSearchInput:
  //        a. Fetch from `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${TOKEN}&types=address`
  //        b. Limit results to 5 and update suggestions state.
  //    - handleFinalSave:
  //        a. Call the `updateAddress` server action.
  //        b. Logic: onClose() and onLoginSuccess().

  if (!isOpen) return null;

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus to next box
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").slice(0, 6);
    if (!/^[0-9]+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus last filled box
    const container = event.target.parentElement;
    const inputs = container.querySelectorAll("input");
    const lastIndex = pastedData.length;
    if (inputs[lastIndex]) inputs[lastIndex].focus();
  };

  // 1. Send OTP
  const onSendOTP = async (phoneNumber) => {
    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      const result = await signInWithPhoneNumber(
        auth,
        "+91" + phoneNumber,
        verifier,
      );
      setConfirmationResult(result);
      setResendTimer(60);
      setExpiryTimer(300); // 5 Minutes
      setStep(2);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("OTP Error: ", error);
      toast.error("Error sending OTP on this number, please try again later!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  // 2. Verify & Login to NextAuth
  const onVerifyOTP = async (otpString) => {
    try {
      const userCredential = await confirmationResult.confirm(otpString);
      const phoneNum = userCredential.user.phoneNumber;

      // This triggers the 'authorize' function in route.js
      const res = await signIn("credentials", {
        phone: phoneNum,
        redirect: false,
      });

      if (res.ok) {
        toast.success("Phone verified!");
        setStep(3);
      } else {
        toast.warning("Login failed, please check your number.");
      }
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error("Invalid Code. Please check the digits.");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal Content */}
        <div className="relative bg-white w-full max-w-[850px] min-h-[500px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
          {/* Left Side - Brand & Promo */}
          <div className="w-full md:w-1/2 bg-[#3BB77E] p-10 flex flex-col justify-center text-white relative h-48 md:h-auto">
            <div className="relative z-10">
              <div className="text-4xl font-black mb-4 flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-15 h-15" />
                Quickzy
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Fastest Delivery in your city
              </h2>
              <p className="text-green-100 text-sm font-medium">
                Get your groceries delivered in minutes.
              </p>
            </div>
            {/* Subtle decorative logo */}
            <div className="absolute bottom-[-20px] right-[-20px] w-64 h-64 opacity-10 rotate-12 select-none pointer-events-none filter">
              <img
                src="/logo.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FiX size={24} />
            </button>

            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-2xl font-black text-[#253D4E] mb-2 tracking-tight">
                    Login or Signup
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">
                    Enter your mobile number to get started
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center border-2 border-gray-100 rounded-2xl px-5 py-4 focus-within:border-[#3BB77E] transition-all bg-gray-50">
                    <span className="text-gray-400 font-black mr-3 text-lg">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter Mobile Number"
                      className="flex-1 bg-transparent outline-none text-[#253D4E] font-black text-lg h-full"
                      value={phone}
                      autoFocus
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                        setPhone(value);
                      }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (phone.length === 10) {
                        onSendOTP(phone);
                      } else {
                        toast.info("Please enter a valid 10-digit number");
                      }
                    }}
                    className="w-full bg-[#3BB77E] text-white py-5 rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-[#29A56C] transition-all flex items-center justify-center gap-2 group text-lg"
                  >
                    Send OTP{" "}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <p className="text-[10px] text-center text-gray-400 font-bold px-4 leading-relaxed">
                  By continuing, you agree to our{" "}
                  <button className="text-[#3BB77E]">Terms of Service</button> &{" "}
                  <button className="text-[#3BB77E]">Privacy Policy</button>
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="text-center">
                  <h3 className="text-2xl font-black text-[#253D4E] mb-2 tracking-tight">
                    Verify OTP
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">
                    Sent to +91 {phone}
                  </p>
                </div>

                <div className="flex justify-between gap-3">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onFocus={(e) => e.target.select()} // Select existing text on focus
                      onPaste={handleOtpPaste}
                      className="w-14 h-16 border-2 border-gray-100 rounded-2xl bg-gray-50 text-center text-2xl font-black text-[#3BB77E] outline-none focus:border-[#3BB77E] transition-all"
                    />
                  ))}
                </div>

                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => onVerifyOTP(otp.join(""))}
                    className="w-full bg-[#3BB77E] text-white py-5 rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-[#29A56C] transition-all text-lg"
                  >
                    Verify & Continue
                  </button>
                  <div className="text-center text-red-400 font-bold text-sm">
                    Expires in: {Math.floor(expiryTimer / 60)}:
                    {(expiryTimer % 60).toString().padStart(2, "0")}
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <p className="text-sm font-bold text-gray-400">
                    Didn't receive?{" "}
                    <button
                      disabled={resendTimer > 0}
                      onClick={() => {
                        onSendOTP(phone);
                        setResendTimer(60);
                        setExpiryTimer(300);
                      }}
                      className={`font-black ${resendTimer > 0 ? "text-gray-300" : "text-[#3BB77E]"}`}
                    >
                      {resendTimer > 0
                        ? `Resend in ${resendTimer}s`
                        : "Resend Code"}
                    </button>
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-gray-300 hover:text-red-400 transition-colors"
                  >
                    Edit phone number
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-2xl font-black text-[#253D4E] mb-2 tracking-tight">
                    Select Location
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">
                    Where should we deliver?
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-50 hover:border-[#DEF9EC] cursor-pointer transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#3BB77E] group-hover:bg-[#DEF9EC] transition-colors">
                        <FiNavigation size={22} />
                      </div>
                      <div>
                        <p className="font-black text-[#253D4E] text-sm">
                          Use Current Location
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Using GPS
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-50 hover:border-[#DEF9EC] cursor-pointer transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-orange-400 group-hover:bg-orange-50 transition-colors">
                        <FiHome size={22} />
                      </div>
                      <div>
                        <p className="font-black text-[#253D4E] text-sm">
                          Home
                        </p>
                        <p className="text-xs text-gray-400 font-bold">
                          B-102, Green Valley Estate, Mumbai
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-gray-100"></div>
                    <span className="relative bg-white px-4 text-[10px] font-black uppercase text-gray-300 mx-auto block w-fit">
                      OR
                    </span>
                  </div>

                  <div className="relative group/search">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-[#3BB77E] transition-colors" />
                    <input
                      type="text"
                      placeholder="Search area, street name..."
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#3BB77E] transition-all font-bold text-sm text-[#253D4E]"
                    />
                  </div>

                  <button
                    onClick={() => {
                      onLoginSuccess();
                      onClose();
                    }}
                    className="w-full bg-[#253D4E] text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all"
                  >
                    Confirm & Start Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Hidden container for Firebase Recaptcha */}
        <div id="recaptcha-container"></div>
      </div>
    </>
  );
};

export default AuthModal;
