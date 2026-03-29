# Quickzy - High-Performance Quick Commerce Engine

Quickzy is a sophisticated, feature-rich Quick Commerce (Q-Commerce) platform designed to demonstrate a near-production-level implementation of a hyper-local delivery service. Built with a focus on speed, aesthetics, and robust logic, Quickzy bridges the gap between a standard e-commerce site and a scalable production engine.

> [!IMPORTANT]
> Project Maturity: This is a high-level simulation. While it implements complex real-time logic for payments, inventory, and location-based guards, it is designed for demo purposes. Scale-intensive features like real-time GPS courier tracking, SMS-OTP gateways, and auto-scaling infrastructure are intentionally simulated or simplified.

---

## Key Features

### End-User Experience (Front-End)
- **Mandatory Location Guard**: Powered by Leaflet & LocationIQ, ensuring delivery feasibility via coordinate-based geocoding before access to the shop.
- **Zap Navigation**: Utilizing Next.js SPA routing for instantaneous page transitions and a "lightning-fast" feel.
- **Smart Checkout Flow**: 
    - Real-time cart state synchronization with local persistence.
    - **Sync Fingerprint Technology**: Automated price reconciliation against the database source-of-truth during tab visibility changes.
- **Dynamic Coupon Engine**: Validates minimum order thresholds and applies percentage/flat discounts in real-time.
- **Multi-Tier Payments**: Native integration with Razorpay (Test Mode) for secure digital transactions.
- **Advanced Cataloging**: Intensive search functionality and category-based filtering across 11+ departments.
- **Wishlist System**: Persistent "Saved for Later" functionality with micro-animations for user engagement.
- **Secure Auth**: NextAuth-powered Magic Link & Google OAuth for a friction-less, password-less login experience.

### Administrative Power (Back-End)
- **Metric Dashboard**: Real-time sales aggregation, order volume tracking, and user growth statistics.
- **Inventory Lifecycle (CRUD)**: Direct management of products with automated Cloudinary asset cleanup to prevent orphan storage.
- **Coupon Management**: Control promotional codes, usage limits, and active status toggles from a centralized UI.
- **Live Banner CMS**: Hot-load homepage sliders and promotional banners directly into the MongoDB Atlas layer.
- **User & Order Audit**: Full visibility into customer profiles, order status (Pending -> Processing -> Delivered), and transaction details.
- **Genesis Admin Protection**: Structural security prevents the modification or revocation of the primary developer account.

---

## Technical Architecture & Stack

Quickzy utilizes a Modern Monolithic architecture, leveraging Next.js as the unified full-stack framework.

### The Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16.1.4](https://nextjs.org/) (App Router) |
| **Core UI** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4.0](https://tailwindcss.com/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/) (NoSQL) |
| **ODM / Driver** | [Mongoose 9.x](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) |
| **Payments** | [Razorpay SDK](https://razorpay.com/) |
| **Assets** | [Cloudinary API](https://cloudinary.com/) |
| **Geocoding** | [LocationIQ API](https://locationiq.com/) |

### Backend & Database Implementation
- **Server-Side Logic**: 100% of data mutations are handled via Next.js Server Actions, providing a secure, type-safe bridge to the database without exposing manual REST endpoints.
- **State Management**: React Context API is used for global state (Store, Cart, Wishlist, Auth), ensuring high performance without the architectural overhead of Redux.
- **MVC Pattern**: While Next.js is "Route-Focused," we follow a strict Models-Actions-Components separation to ensure maintainable, readable code.
- **Model Layer**: 8 core Mongoose models (Product, Category, User, Order, Payment, Coupon, Banner, BlogPost).

---

## Project Structure

```text
├── actions/             # Secure Server Actions (Project Logic)
├── app/                 # Next.js App Router (Pages, API & Layouts)
│   ├── admin/           # Administrative Panel Modules
│   ├── api/             # Webhooks & Auth Route Handlers
│   ├── cart/            # Horizontal-layout Shopping Cart
│   ├── shop/            # Category & Search focused catalog
│   └── ...              # Wishlist, Checkout, Blog, Profile
├── components/          # Reusable UI Atoms & Molecules
├── context/             # Global Providers (Source of Truth)
├── db/                  # MongoDB Connection Pooling
├── models/              # Mongoose Schemas (Database Structure)
├── public/              # Brand Assets & UI Media
├── scripts/             # Maintenance, Seeding & Export Utilities
├── seed-data/           # JSON Source for initial Inventory
```

---

## Known Implementation Limits (The "Dummy" Aspects)

To maintain focus on core UX and logic, some enterprise features are simulated:
1. **SMS Integration**: Currently uses simulated developer logic; not connected to production Short-Code gateways.
2. **Delivery Tracking**: Order tracking is "Status-Based" (Placed to Delivered); no real-time GPS logistics API is integrated.
3. **Scalability**: While the logic is robust, it is tuned for boutique-scale demo environments rather than multi-region clusters.
4. **Hardcoded UI**: Certain specialized layout themes utilize optimized hardcoding for performance and visual consistency.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas Account
- Cloudinary & Razorpay Developer API Keys

### Installation
1. Clone the repository: `git clone https://github.com/pjha91275/Quickzy.git`
2. Install dependencies: `npm install`
3. Configure `.env.local` using `.env.example` as a template.
4. Seed the initial inventory: `npm run seed`
5. Start the development server: `npm run dev`

---

*Handcrafted by Prince Jha*
