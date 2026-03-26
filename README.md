# 🌿 Quickzy – Fast. Fresh. Delivered.

Quickzy is a high-performance, boutique **Quick Commerce** (Q-Commerce) engine designed to blur the line between a concept study and a production-ready retail platform. Built with a "Sophomore Developer" philosophy—focusing on clean, readable, and functional code—Quickzy delivers a premium user experience while maintaining a robust administrative backbone.

> [!NOTE]
> This project is a **high-level simulation** of a Q-Commerce business. While it implements near-production logic for payments, inventory, and location-based constraints, certain production-scale features (like real-time delivery tracking, auto-scaling clusters, or SMS-OTP gateways) are simulated or utilize simplified developer-tier integrations.

---

## 🚀 Premium Features & Experience

### 🛍️ End-User Experience
- **⚡ Lightning UI**: Built on **React 19** and **Next.js 15/16**, the interface is optimized for split-second interactions and silky transitions.
- **📍 Location-Aware Guard**: Mandatory location confirmation via **Leaflet & LocationIQ** ensures delivery feasibility before the user even starts shopping.
- **🛒 Smart Shopping Cart**: A persistent, local-first cart system that synchronizes seamlessly with the visual UI.
- **🏷️ Dynamic Coupon Engine**: Fully functional discount logic supporting Percentage and Flat-rate reductions with minimum order threshold validation.
- **🔍 Intelligent Search & Filter**: Search by product name or browse through **11 specialized categories** (Milk/Dairy, Electronics, Fresh Veg, etc.).
- **💳 Multi-Tier Payments**: Secure checkout flow integrated with **Razorpay**, supporting test-mode transactions and order status persistence.

### 🛠️ Administrative Power (Admin Panel)
- **📊 Real-time Dashboard**: Live metrics for Total Sales, Orders, Products, and active Users using premium Remix Icons.
- **🛡️ Genesis Admin Protection**: Hardcoded structural security preventing the modification or revocation of the primary developer account.
- **📦 Inventory Lifecycle**: Direct control over Product seeding, creation, and deletion with automated **Cloudinary image cleanup** (Orphan storage protection).
- **🎞️ Live Banner Management**: Editable homepage promotional sliders with support for HTML-in-JSON titles and subtitle hot-editing.
- **🎫 Coupon Controls**: Creation, management, and real-time status toggling of promotional codes.
- **👥 User & Role Audit**: View all registered customers and manage administrative privileges with a single click.

---

## 🛠️ Technical Architecture & Stack

Quickzy follows a **Modern Monolithic** approach with a strong separation of concerns, utilizing Next.js as the full-stack bridge.

### **The Tech Stack**
| Layer | Technology |
| :--- | :--- |
| **Core Framework** | [Next.js 16.1.4](https://nextjs.org/) (App Router) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4.0+](https://tailwindcss.com/) (Standardized Variables) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/) (NoSQL) |
| **ODM / DB Driver** | [Mongoose 9.x](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) |
| **Payment Gateway** | [Razorpay SDK](https://razorpay.com/) |
| **Image Hosting** | [Cloudinary API](https://cloudinary.com/) |
| **Geocoding** | [LocationIQ](https://locationiq.com/) |

### **Project Architecture**
- **Architecture Style**: Next.js App Router (Hybrid SSR/CSR).
- **State Management**: **React Context API** (Cart, Wishlist, Store, and Auth contexts) avoids the complexity of Redux while providing global availability.
- **Backend Logic**: **Server Actions** are used for 90% of data mutations (Admin tasks, User updates), providing a type-safe and secure bridge without manual REST endpoints.
- **Security Middleware**: Native Next.js `middleware.js` protects the `/admin` and `/profile` routes from unauthorized access.

---

## 📂 Project Structure

```text
├── actions/             # Secure Server Actions (Admin, DB, Payments)
├── app/                 # Next.js App Router
│   ├── admin/           # Fully-featured Admin Panel Modules
│   ├── api/             # Webhook & API Route Handlers (Razorpay, Auth)
│   ├── cart/            # Horizontal-layout Shopping Cart
│   ├── shop/            # Category & Search focused catalog
│   └── ...              # About, Blog, Contact, Wishlist, Checkout
├── components/          # Reusable UI Atoms & Molecules
├── context/             # Global State Providers (Store, Cart, Auth)
├── db/                  # MongoDB Connection & Configuration
├── models/              # Mongoose Schemas (User, Order, Product, Banner)
├── public/              # Brand Assets & Optimized Media
├── scripts/             # Database Seeding & Maintenance Utilities
└── seed-data/           # JSON Source of Truth for Categories/Products
```

---

## 🔌 Third-Party Integrations

Quickzy leverages industry-standard APIs to provide a "Near-Production" feel:
- **Cloudinary**: Handles high-performance image delivery, resizing, and provides an API for automated asset destruction upon product deletion.
- **Razorpay**: Integrated via a custom API route to handle order creation and client-side payment verification.
- **LocationIQ**: Powers the reverse geocoding inside the `LocationModal` to provide human-readable addresses from coordinate data.
- **NextAuth**: Powers the "User first" authentication experience with MongoDB session persistence.

## 🚧 Known Limitations (The "Dummy" Aspects)

To keep this project focused on UI/UX and Core Logic, the following are intentionally simplified:
1. **SMS/Phone Login**: Currently uses developer-tier simulated flows; production-scale SMS gateways are not active.
2. **Order Lifecycle**: Order tracking stops at "Placed"/ "Processing". No real-time GPS courier tracking or logistics API is connected.
3. **Scalability**: Designed for boutique/demo scale. Large-scale database sharding or edge caching are not implemented.
4. **Maintenance**: While mostly dynamic, some UI elements utilize developer-friendly hardcoding for specific layout themes.

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas Cluster
- Cloudinary & Razorpay Developer Accounts

### Installation
1. Clone the repo: `git clone https://github.com/pjha91275/Quickzy.git`
2. Install deps: `npm install`
3. Setup `.env.local`:
   ```env
   MONGO_URI=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   NEXT_PUBLIC_RAZORPAY_KEY=...
   RAZORPAY_SECRET=...
   NEXT_PUBLIC_LOCATIONIQ_KEY=...
   NEXTAUTH_SECRET=...
   ```
4. Seed the Database: `npm run seed`
5. Launch: `npm run dev`

---

*Made with ❤️ by Prince Jha*
