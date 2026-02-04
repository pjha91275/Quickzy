import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Payment from "@/models/Payment";

// --- QUICKZY AUTH TODO ---
// 1. Switch GitHubProvider to CredentialsProvider (for Phone + OTP logic).
// 2. In authorize():
//    a. Verify the OTP FIRST (check a temp 'Otps' collection or trust Firebase client-side verification).
//    b. If valid, check if user exists in 'Users' DB.
//    c. If they don't exist, CREATE them (Sign Up); if they do, just LOGIN.
// 3. In session() callback: populate session.user with phone, address, and name from MongoDB.

// ... imports

export const authoptions = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
      },
      async authorize(credentials) {
        await connectDb();

        // This function is called means verification was a success.
        const phone = credentials.phone;

        let user = await User.findOne({ phone });

        if (!user) {
          user = await User.create({
            phone: phone,
            name: "New Guest",
          });
        }

        return user;
      },
    }),
  ],
callbacks: {
    async session({ session, token }) {
      const dbUser = await User.findOne({ phone: session.user.phone || session.user.email });
      if (dbUser) {
        session.user.name = dbUser.name;
        session.user.phone = dbUser.phone;
        session.user.address = dbUser.address; 
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { authoptions as GET, authoptions as POST };
