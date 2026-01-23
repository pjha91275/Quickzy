"use client";

import React, { useState } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { fetchUser, fetchPayments, initiate } from "@/actions/useractions";
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useRouter } from "next/navigation";

const PaymentPage = ({ username }) => {

  const { data: session } = useSession();

  const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" });
  const [currentUser, setcurrentUser] = useState({});
  const [payments, setpayments] = useState([]);
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("paymentdone") == "true") {
      toast('Thanks for your donation!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    router.push(`/${username}`)

  }, [])

  useEffect(() => {
    getData()
  }, [])

  const handleChange = (e) => {
    setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
  }

  const getData = async (params) => {
    let u = await fetchUser(username)
    setcurrentUser(u)
    let dbpayments = await fetchPayments(username)
    setpayments(dbpayments)
  }

  const pay = async (amount) => {
    // Check if Razorpay credentials are present
    if (!currentUser.razorpayid || !currentUser.razorpaysecret) {
      toast.error("The Creator has not set up their razorpayid and razorpaysecret yet!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    // Check form validation
    if (paymentform.name.length < 3 || paymentform.message.length < 4 || amount < 1) {
      toast.error("Please enter a valid Name (3+ chars), Message (4+ chars) and Amount (1+ chars)!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    //Get the order Id
    let a = await initiate(amount, username, paymentform)
    let orderId = a.id;
    var options = {
      "key": currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
      "amount": amount, // Amount is in currency subunits. 
      "currency": "INR",
      "name": "Get Me A Chai", //your business name
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        "name": "Gaurav Kumar", //your customer's name
        "email": "gaurav.kumar@example.com",
        "contact": "+919876543210" //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" />
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      <div className={`cover w-full relative ${!(currentUser?.coverpic) ? "border-1" : ""} `}>
        <img
          className="object-cover w-full h-48 md:h-[350] shadow-blue-700 shadow-sm"
          src={currentUser?.coverpic || undefined}
          alt=""
        />
        <div className="absolute -bottom-20 right-[38%] md:right-[46%] border-white overflow-hidden border-2 rounded-full size-36">
          <img
            src={currentUser?.profilepic || undefined}
            alt=""
            className="rounded-full object-cover size-36"
            width={150}
            height={150}
          />
        </div>
      </div>

      <div className="info flex justify-center items-center my-24 flex-col gap-2">
        <div className="font-bold text-lg">@{username}</div>
        <div className="text-slate-400">Lets help {username} get a chai!</div>
        <div className="text-slate-400">
          {payments.length} Payments.  ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
        </div>

        <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
          <div className="suppoters w-full md:w-1/2 bg-[#231053] rounded-lg text-white p-10">
            <h2 className="text-2xl font-bold my-5 text-[#8a3bd9]">Top 10 Supporters</h2>
            <ul className="mx-5 text-lg">
              {payments.length === 0 && <div>No supporters yet</div>}
              {payments.slice(0, 10).map((p, i) => (
                <li key={i} className="my-4 flex gap-2 items-center">
                  <img width={33} src="avatar.gif" alt="user avatar" />
                  <span>
                    {p.name} donated <span className="font-bold">₹{p.amount}</span> with a
                    message "{p.message}"
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="makePayment w-full md:w-1/2 bg-[#231053] rounded-lg text-white p-10">
            <h2 className="text-2xl font-bold my-5 text-[#8a3bd9]">Make a Payment</h2>
            <div className="flex gap-2 flex-col">
              <div>
                <input onChange={handleChange} value={paymentform.name} name="name"
                  type="text" className="w-full p-3 rounded-lg bg-white text-black font-semibold"
                  placeholder="Enter Name"
                />
              </div>
              <input onChange={handleChange} value={paymentform.message} name="message"
                type="text" className="w-full p-3 rounded-lg bg-white text-black font-semibold"
                placeholder="Enter Message"
              />
              <input onChange={handleChange} value={paymentform.amount} name="amount"
                type="text" className="w-full p-3 rounded-lg bg-white text-black font-semibold"
                placeholder="Enter Amount"
              />
              <button onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                type="button"
                className={`text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${paymentform.name.length < 3 || paymentform.message.length < 4 || paymentform.amount.length < 1 ? "disabled:bg-slate-600 disabled:from-purple-100 opacity-60 cursor-not-allowed" : ""}`}
              >
                Pay
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2 mt-5">
              <button className={`p-3 rounded-lg 
    ${(paymentform.name.length < 3 || paymentform.message.length < 4)
      ? "bg-slate-400 cursor-not-allowed"
      : "bg-slate-800 hover:bg-slate-700"}
  `} onClick={() => { pay(1000) }}>Pay ₹10</button>
              <button className={`p-3 rounded-lg 
    ${(paymentform.name.length < 3 || paymentform.message.length < 4)
      ? "bg-slate-400 cursor-not-allowed"
      : "bg-slate-800 hover:bg-slate-700"}
  `} onClick={() => { pay(2000) }}>Pay ₹20</button>
              <button className={`p-3 rounded-lg 
    ${(paymentform.name.length < 3 || paymentform.message.length < 4)
      ? "bg-slate-400 cursor-not-allowed"
      : "bg-slate-800 hover:bg-slate-700"}
  `} onClick={() => { pay(3000) }}>Pay ₹30</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default PaymentPage;
