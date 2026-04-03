# ⚡ Quickzy: Fast. Fresh. Delivered in a Zap.

**Quickzy** is a high-performance, **Quick Commerce** (Q-Commerce) platform built to deliver essentials in under 15 minutes. It bridges the gap between traditional e-commerce and instant grocery delivery through a premium, responsive user interface and a robust administrative backend.

> [!NOTE] 
> This is an **Advanced Full-Stack Q-commerce Model**—a non-commercial, feature-rich project built to explore integrated development, administrative systems, and real-time business logic. It provides a comprehensive study of application workflows, focusing on core logic patterns rather than high-scale production throughput.

---

## 🚀 Tech Stack

Quickzy leverages a modern, full-stack architecture designed for speed and reliability:

### **Frontend**
*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) with **React 19** and **JavaScript** - Utilizing Server Components, Client Components, and Turbopack for premium rendering.
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) - Leveraging the latest utility-first features for premium design.
*   **Icons:** React Icons (Fi, Ri, Hi) for a consistent, professional aesthetic.
*   **Notifications:** React Toastify for real-time user feedback.

### **Backend & Database**
*   **Runtime:** Node.js with Next.js Server Actions for secure, server-side data mutations.
*   **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) - A cloud-scale NoSQL database for flexible data modeling.
*   **ORM:** Mongoose for schema-based data validation and modeling.
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/) - Secure login via Google OAuth and Magic Links (Brevo SMTP).

### **Storage & Infrastructure**
*   **Media Management:** [Cloudinary](https://cloudinary.com/) - Dynamic asset hosting with optimized delivery and sequential naming conventions.
*   **Email Service:** Brevo (formerly Sendinblue) for transactional magic link authentication and platform contact form communications.

---

## ✨ Features

### **🛒 Storefront (Customer Experience)**
*   **Dynamic Discovery:** A rich, premium homepage featuring Hero Banners, Featured Categories, Popular Products (atleast 1-per-category), Daily Best Sells, Deals Of The Day, Top Selling, Trending, Top Picks, and Recently Added sections.
*   **Advanced Shopping:**
    *   Fuzzy search and category filtering in the Shop.
    *   Price-range sliders and recency-based "New Products" sidebar.
    *   **Commercial Floor:** Enforced 15 Rupee minimum for all products and cart totals to maintain commercial integrity.
*   **State Management:**
    *   **Cart Context:** Persisted cart logic with dynamic totals, integer-bound discount calculations, and 15 INR price protection.
    *   **Wishlist Context:** Interactive heart-pop animations and real-time wish-state tracking.
    *   **Idempotent Store:** Data only reshuffles on a hard reload, maintaining placement stability during navigation.
*   **Responsive Experience:** Optimized for seamless navigation across Mobile, Tablet, and Desktop viewports.
*   **Checkout, Location, Profile & Order History:**
    *   **Checkout Process:** A dedicated **Checkout page** with a streamlined multi-step flow for address selection and payment confirmation.
    *   **Location-Aware Geocoding:** Integrated **LocationIQ** and **Leaflet** for real-time address discovery and interactive map visualization.
    *   **Mock Payment Integration:** Secure, test-mode payment fulfillment powered by the **Razorpay API**.
    *   **Status Tracking:** Personal profile management and comprehensive order history with simulated arrival times.
*   **Content & Engagement:** Professional **About** and **Contact** outreach pages alongside an integrated **Blog** ecosystem for community insights.

### **🛠 Admin Panel (Business Operations)**
*   **Responsive Dashboard:** Optimized for professional management across Mobile, Tablet, and Desktop viewports.
*   **Real-time Metrics:** A dashboard monitoring total sales (INR), order counts, product counts, and total users.
*   **Product & Banner Management:**
    *   Full CRUD for products with automated **Cloudinary Sequential Naming** (`product-50`, `product-51`) and image identity persistence during updates.
    *   Dynamic category creation with real-time product count synchronization and automated 0-count garbage collection for UI hygiene.
    *   Hero and Footer banner control with live preview links.
*   **Promotion Engine:** Full **Coupon Management** (CRUD) with support for fixed/percentage discounts, usage limits, and minimum order requirements.
*   **Order Fulfillment:**
    *   **Dynamic Status Management:** Administrative control over order states (Pending, Processing, Delivered, Cancelled).
    *   **Security Lockdown:** Admin retains full override control over internally-cancelled orders, while user-initiated cancellations remain immutable for security.
*   **User Management:** Administrative role toggling (User to Admin) and security for "Genesis Admin" accounts.

---

## 🏛 Technical & Logical Highlights

### **1. Sequential Sync Algorithm**
To maintain a professional asset library in Cloudinary, the system calculates the next product or banner number based on database counts, ensuring assets are organized as `product-1`, `product-2`, etc., preventing the usual UUID chaos of most dummy apps.

### **2. MVC-Adjacent Pattern**
The project separates concerns by using Mongoose Models (`/models`), Server Actions (`/actions`) for controller logic, and React Components (`/components`) for views, strictly following Next.js 16 best practices.

---

## 🚧 Known Limitations (Production Gaps)

While Quickzy is technically advanced, the following features are not currently implemented for this version:
*   **Mobile Login:** Currently relies on Email/Google; SMS-based OTP login is a future roadmap item.
*   **Simulated Logistics:** No real products or physical delivery occurs; the system is a functional simulation featuring integrated **Changing Expected Order Arrival Time** logic, but without live GPS or a physical driver fleet.
*   **Component Modularity:** Some UI components are hardcoded for specific layouts (e.g., the 3-card promo banner) and may require refactoring for extreme modularity.
*   **Traffic Capacity:** Not designed or optimized for high-traffic commercial use or large-scale concurrency.
*   **Business Operations:** This is a **dummy application**; payment gateway integration is in test-mode and no real commerce is facilitated.

---

## 📁 Folder Structure

```text
/actions       # Server Actions for mutations (Admin, DB, User)
/app           # Next.js App Router (Pages & API routes)
/components    # Reusable UI components & Layouts
/context       # React Context API (Cart, Wishlist, Store)
/db            # Database connection & MongoDB client
/lib           # Utility functions & formatting
/models        # Mongoose Data Schemas
/public        # Static assets (Logos, Icons, etc.)
/scripts       # Seeding scripts for DB and Cloudinary
/seed-data     # JSON assets for initial project setup
```

---

## 💻 Getting Started

1.  **Clone the Repo:** `git clone https://github.com/pjha91275/Quickzy.git`
2.  **Install Dependencies:** `npm install`
3.  **Environment Setup:** Fill in your configuration in the provided `.env.example` file (ensure you have all keys for **MongoDB, Razorpay, Cloudinary, Google OAuth, Brevo SMTP,** and **LocationIQ**). Then, rename the file to `.env.local`.
4.  **Seed the Data:** 
    *   `node scripts/seed-db.cjs` (Products/Categories)
    *   `node scripts/seed-cloudinary.cjs` (Visual Assets)
    *   `node scripts/seed-coupons.cjs` (Coupons)
    *   `node scripts/make_admin.cjs` (Genesis Admin Account)
5.  **Run Dev:** `npm run dev`

---

Built to Deliver in a Zap 🛒⚡ by **Prince Jha**
