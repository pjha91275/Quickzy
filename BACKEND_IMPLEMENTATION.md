# Quickzy Backend Implementation Guide

This document outlines the architectural flow and technical implementation steps for transitioning **Quickzy** from a static frontend to a dynamic, database-driven application.

---

## 1. Architectural Overview

Since you are using **Next.js (App Router)**, you have two primary ways to handle the backend:

1.  **Server Components**: Fetch data directly in your `page.js` using asynchronous functions. This is perfect for the **Homepage**.
2.  **Server Actions**: Functions that run on the server but are triggered by client-side events (like clicking "Add to cart").

### The Basic Flow

1.  **Request**: Browser requests a page.
2.  **Server**: Connects to Database -> Fetches Data -> Renders HTML.
3.  **Response**: Browser receives fully rendered page with current prices/stock.

---

## 2. Database Schema (Mongoose Models)

You currently have `User` and `Payment`. You need a **Product** model to replace your hardcoded arrays.

### Syntax Hint: Product Model

Create `/models/Product.js`:

- `name`: String
- `price`: Number (Store as numbers for math!)
- `category`: String (e.g., "Electronics")
- `img`: String (URL)
- `stock`: Number
- `isDeal`: Boolean (For your "Deals of the Day" section)

---

## 3. Homepage Flow

Currently, your products are in a static `const`. To make it dynamic:

### Backend Logic

1.  Import your `connectDb` and `Product` model into `app/page.js`.
2.  Convert the `Home` function to `async`.
3.  Query the database for all products or filter by section (e.g., `Product.find({ isDeal: true })`).

### React Hint

- Instead of mapping over `products`, you will map over the data returned from your database query.
- **Security Tip**: Never expose your database URI directly in the code; use `.env.local`.

---

## 4. Cart Coordination Flow

The "Cart" state is tricky because it usually involves both the **Client** (for speed) and the **Server** (for persistence).

### Strategy: Hybrid Flow

1.  **Frontend State**: Use React state to handle adding/removing items for an "instant" feel.
2.  **Database Persistence**: When a user clicks "Checkout" or updates quantity, trigger a **Server Action** to save the cart state to the `User` model in the database.
3.  **Synchronization**: When the Cart page loads, it should fetch the latest prices from the `Product` collection to ensure the user isn't buying something at an old price.

### Backend Implementation Hint

- **API Route/Action**: Create a function that takes `userId` and `cartItems`.
- **Logic**: Find user -> Update `cart` field -> Return success.

---

## 5. React Adjustments (Next.js Specific)

To coordinate between pages, you'll need to move away from local constants.

1.  **Loading States**: Since DB fetching takes time, use a `loading.js` file in your app directory for automatic skeletons.
2.  **Revalidation**: Use `revalidatePath('/')` in your backend functions so the homepage updates instantly when a product price changes.
3.  **Context API**: Consider using React Context for the Cart if you want the cart count in the Navbar to update without a page refresh.

---

## 6. Next Steps for You

1.  **Seed your Database**: Write a small script to take your current `const products` array and insert them into your MongoDB collection.
2.  **Fetch on Home**: Try fetching just one category first to test the connection.
3.  **Cart Model**: Update your `User` model to include a `cart` array that stores `productId` and `quantity`.

_Happy Coding! You've got the UI looking great, now it's time to bring it to life._
