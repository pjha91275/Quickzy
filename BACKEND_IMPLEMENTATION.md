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

---

## 2. Updated Implementation Flow (Priority Order)

### Phase 1: Authentication & Single Sign-On (Phone-Only)

**Goal: Minimal friction, Zepto-style entry via AuthModal.**

- **Architectural Flow**:
  1. **One-Time Identity**: No separate Login/Signup. User enters Phone Number -> `User.findOrCreate()`.
  2. **OTP Verification**: Triggered via **Firebase Auth** (Phone). Modal stays active and "freezes" background.
  3. **Success**: Once verified, transition modal to Step 2 (Location selection).

- **Free APIs to Use**:
  - **Auth/OTP**: [Firebase Phone Auth](https://firebase.google.com/) (10k free verifications/mo).

### Phase 2: Geolocation & Address Confirmation

**Goal: Instant delivery context.**

- **Architectural Flow**:
  1. **GPS Fetch**: Modal Step 2 prompts for location using `navigator.geolocation`.
  2. **Search Autocomplete**: Use **Mapbox Search API** for manual address lookup within the modal.
  3. **Completion**: Once "Confirm" is clicked, modal closes and `isLoggedIn` state updates across the app.

- **Free APIs to Use**:
  - **Map Search**: [Mapbox Search API](https://www.mapbox.com/search-service) (100k free searches/mo).
  - **Reverse Geocoding**: [BigDataCloud](https://www.bigdatacloud.com/).
---

## 3. Database Schema Updates (MongoDB/Supabase)

### User Model

```javascript
{
  name: String,
  email: String,
  phone: String,
  address: {
    text: String,
    lat: Number,
    lng: Number,
    zone: String
  },
  cart: [{ productId: ObjectId, quantity: Number }],
  orders: [ObjectId]
}
```

---

## 4. Implementation Protocol

When the user triggers **"implementing Backend plan"**, the assistant will focus on **Phase 1 (Auth)** first, ensuring the UI flows match the verified Quickzy theme.
