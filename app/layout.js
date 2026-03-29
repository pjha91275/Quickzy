import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quickzy - Fast. Fresh. Delivered in a Zap.",
  description:
    "Quickzy: Your daily essentials, groceries, electronics and more, delivered instantly.",
};

import LocationGuard from "@/components/LocationGuard";
import { fetchCategories } from "@/actions/dbactions";
import { StoreProvider } from "@/context/StoreContext";

export default async function RootLayout({ children }) {
  const categories = await fetchCategories();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen font-sans overflow-x-hidden`}
      >
        <SessionWrapper>
          <StoreProvider>
            <CartProvider>
              <WishlistProvider>
                <LocationGuard>
                  <Navbar initialCategories={categories} />
                  {children}
                  <Footer />
                </LocationGuard>
                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar={false}
                />
              </WishlistProvider>
            </CartProvider>
          </StoreProvider>
        </SessionWrapper>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
