# Quickzy Backend Implementation Strategy

This document serves as the master blue-print for transitioning **Quickzy** to a dynamic, database-integrated platform.

---

## 1. Core Architectural Decisions

### Data Persistence

- **Cart Management**: The cart will be stored as an **array of `{ productId, quantity }` objects within the User model**. This ensures a single database query retrieves both user profile and active shopping data.
- **Immediate Sync**: Every "Add to Cart" or quantity change will trigger a Server Action to persist the state directly to the database, ensuring cross-device consistency.

### Page Hierarchy

- **Homepage (Curated Billboard)**: Displays high-level highlights (Deals of the Day, Top Selling) using limited queries (e.g., `Product.find().limit(10)`).
- **Products Page (Main Aisle)**: A dedicated `/products` route showing the full catalog with search and category filtering capabilities.

---

## 2. Updated Implementation Flow (Priority Order)

### Phase 1: Authentication & User Context

**Goal: Establish the "Who".**

- Implement **NextAuth/Auth.js** (Google/GitHub or Credentials).
- Update the `User` model to include the `cart` array.
- _Dependencies_: All subsequent features (saving carts, personalized experience) rely on a valid `userId`.

### Phase 2: Database Seeding & Schema

**Goal: Establish the "What".**

- Finalize the `Product` model: `name`, `price` (Number), `category`, `img`, `stock`, `isDeal`.
- Create a seeding script to migrate current static data into MongoDB.

### Phase 3: Dynamic Homepage & Products Page

**Goal: Connect the Frontend.**

- **Homepage**: Replace static `const products` with async database fetches.
- **Products Page**: Build the frontend grid and implement backend category filtering (e.g., `/products?category=beverages`).

### Phase 4: Cart Synchronization

**Goal: Close the Loop.**

- Connect "Add to Cart" buttons to Server Actions that update the `User.cart` array.
- Update the **Cart Page** to fetch real-time product data (prices/stock) based on the IDs stored in the user's cart.

---

## 3. Technical Syntax Hints

### Filtering Logic

Use URL search parameters for filtering:

```javascript
// Example logic in /products/page.js
const products = await Product.find(category ? { category: category } : {});
```

### Cart Update Action

```javascript
// Example Server Action logic
await User.findByIdAndUpdate(userId, {
  $set: { cart: updatedCartItems },
});
```

---

## 4. Implementation Protocol

When the user triggers **"implementing Backend plan"**, the assistant will provide inline suggestions and code reviews based strictly on this strategy, focusing on one Phase at a time.
