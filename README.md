# 🌿 Quickzy - Fast. Fresh. Delivered.

Quickzy is a premium, high-performance quick-commerce e-commerce platform built with **Next.js 15**, **Tailwind CSS**, and **MongoDB**. Designed for speed and visual excellence, Quickzy offers an immersive shopping experience with lightning-fast delivery and a sleek, modern UI.

![Quickzy Banner](/custom-banner.png)

## 🚀 Key Features

- **⚡ Instant Delivery**: Optimized for local quick-commerce logistics.
- **📱 Unified Auth Modal**: Seamless Phone + OTP authentication flow that provides a friction-less experience.
- **📍 Smart Location Selection**: Integrated Mapbox & Geolocation for precise delivery tracking.
- **🛒 Dynamic Shopping**: Intelligent product card shuffling and categorized browsing for a fresh feel on every visit.
- **💳 Secure Payments**: Integrated with Razorpay for a smooth checkout process.
- **🎨 Premium UI/UX**: Built with custom animations, glassmorphism, and a vibrant, professional aesthetic.
- **🛠️ Admin Panel**: Comprehensive dashboard for managing products, orders, and users.
- **📝 About & Blog**: Dedicated sections for brand storytelling and community engagement.

## 🛠️ Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/) with Next.js Server Actions & API Routes, [NextAuth.js](https://next-auth.js.org/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose](https://mongoosejs.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Maps**: [Mapbox Search API](https://www.mapbox.com/)

## 📂 Project Structure

```text
├── actions/             # Server Actions (User profiles, Orders, Payments)
├── app/                 # Next.js App Router (Pages & API Routes)
│   ├── api/             # Backend API Endpoints (Auth, Razorpay Webhooks)
│   ├── cart/            # Immersive Shopping Cart Experience
│   ├── shop/            # Dynamic Product Catalog
│   ├── about/           # Brand Story & Mission
│   ├── blog/            # Updates & Articles
│   ├── contact/         # Customer Support & Inquiries
│   ├── wishlist/        # User-saved Favorites
│   ├── admin/           # Comprehensive Admin Dashboard
│   └── page.js          # High-Conversion Landing Page
├── components/          # Reusable UI Components (Navbar, Footer, AuthModal)
├── db/                  # MongoDB Connection Logic
├── models/              # Mongoose Schemas (User, Payment, Product)
└── public/              # Optimized Assets & Brand Identity
```

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Instance (Atlas or Local)
- Razorpay API Keys
- Firebase/Mapbox Credentials

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/pjha91275/Quickzy.git
   cd Quickzy
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

   ```env
   MONGO_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
   RAZORPAY_SECRET=your_razorpay_secret
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👨‍💻 Contributing

Quickzy is currently under active development. Once the primary development phase is complete, the repository will be open for public contributions! Feel free to fork the project and submit pull requests to help make Quickzy the best quick-commerce platform.

---

_Made with ❤️ by the Prince Jha_
