# ⚡ Quickzy: Fast. Fresh. Delivered in a Zap.

**Quickzy** is a high-performance, **Quick Commerce** (Q-Commerce) platform built to deliver essentials in under 15 minutes. It bridges the gap between traditional e-commerce and instant grocery delivery through a premium, responsive user interface and a robust administrative backend.

> [!NOTE] 
> This project is a **Close-to-Production** level application. While it implements complex business logic, real-time data syncing, and administrative control, it is currently a "dummy" implementation for demonstration purposes and is not yet a live commercial entity.

---

## 🚀 Tech Stack

Quickzy leverages a modern, full-stack architecture designed for speed and reliability:

### **Frontend**
*   **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) - Utilizing Server Components and Client Components for optimized rendering.
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
*   **Email Service:** Brevo (formerly Sendinblue) for transactional magic link authentication.

---

## ✨ Features

### **🛒 Storefront (Customer Experience)**
*   **Dynamic Discovery:** A rich homepage featuring Hero Banners, Featured Categories, Popular Products (1-per-category rule), and "Deals of the Day."
*   **Advanced Shopping:**
    *   Fuzzy search and category filtering in the Shop.
    *   Price-range sliders and recency-based "New Products" sidebar.
    *   **Commercial Floor:** Enforced 15 Rupee minimum for all products and cart totals to maintain commercial integrity.
*   **State Management:**
    *   **Cart Context:** Persisted cart logic with dynamic totals and discount calculations.
    *   **Wishlist Context:** Interactive heart-pop animations and real-time wish-state tracking.
    *   **Idempotent Store:** Data only reshuffles on a hard reload, maintaining placement stability during navigation.
*   **Checkout & Profile:** Streamlined checkout process and comprehensive order history with status tracking.

### **🛠 Admin Panel (Business Operations)**
*   **Fully Responsive Dashboard:** Optimized for professional management across Mobile, Tablet (iPad Pro), and Desktop viewports.
*   **Real-time Metrics:** A dashboard monitoring total sales (INR), order counts, user growth, and inventory levels.
*   **Product & Banner Management:**
    *   Full CRUD for products with automated **Cloudinary Sequential Naming** (`product-50`, `product-51`).
    *   Dynamic category creation with real-time product count synchronization.
    *   Hero and Footer banner control with live preview links.
*   **Order Fulfillment:**
    *   Administrative override for order statuses (Processing, Delivered, Cancelled).
    *   Strict cancellation rules: Admin retains control of fulfillment even after a manual cancellation.
*   **User Management:** Administrative role toggling (User to Admin) and security for "Genesis Admin" accounts.

---

## 🏗 Architectural Highlights

### **1. Sequential Sync Algorithm**
To maintain a professional asset library in Cloudinary, the system calculates the next product or banner number based on database counts, ensuring assets are organized as `product-1`, `product-2`, etc., preventing the usual UUID chaos of most dummy apps.

### **2. MVC-Adjacent Pattern**
The project separates concerns by using Mongoose Models (`/models`), Server Actions (`/actions`) for controller logic, and React Components (`/components`) for views, strictly following Next.js 15 best practices.

### **3. Documented Codebase**
The entire codebase is documented following "Professional Developer Standards"—meaning no verbose AI-generated comments, but concise, high-signal block comments (`/* ... */`) that name algorithms and explain complex state transitions for maintainability.

---

## 🚧 Known Limitations (Production Gaps)

While Quickzy is technically advanced, the following features are not currently implemented for this version:
*   **Mobile Login:** Currently relies on Email/Google; SMS-based OTP login is a future roadmap item.
*   **Logistics Sync:** Post-order delivery tracking and live GPS tracking are simulated/not connected to a real delivery fleet.
*   **Ultra-Scalability:** Some UI components are hardcoded for specific layouts (e.g., the 3-card promo banner) and may require refactoring for extreme modularity.
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
/scripts       # Seeding scripts for DB and Cloudinary
/seed-data     # JSON assets for initial project setup
```

---

## 💻 Getting Started

1.  **Clone the Repo:** `git clone https://github.com/pjha91275/Quickzy.git`
2.  **Install Dependencies:** `npm install`
3.  **Environment Variables:** Create a `.env.local` and add:
    *   `MONGO_URI`, `CLOUDINARY_URL`, `NEXTAUTH_SECRET`, `GOOGLE_ID`, `GOOGLE_SECRET`, `BREVO_API_KEY`.
4.  **Seed the Data:** 
    *   `node scripts/seed-db.cjs`
    *   `node scripts/seed-cloudinary.cjs`
5.  **Run Dev:** `npm run dev`

---

Developed with ❤️ by **Pranay J.**
