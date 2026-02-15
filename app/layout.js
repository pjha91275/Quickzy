import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";
import { CartProvider } from "@/context/CartContext";
import { ToastContainer } from "react-toastify";
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen font-sans`}
      >
        <SessionWrapper>
          <CartProvider>
            <Navbar />
            {children}
            <ToastContainer position="bottom-right" autoClose={3000} />
            <Footer />
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
