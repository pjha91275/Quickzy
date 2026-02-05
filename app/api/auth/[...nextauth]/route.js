import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const authoptions = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
      },
      async authorize(credentials) {
        await connectDb();

        // With Firebase, verification happened in the AuthModal (Frontend).
        // This function is only called if the Firebase verification passed.
        const phone = credentials.phone;

        // 1. Find the user
        let user = await User.findOne({ phone });

        // 2. If not found, create a new record (Sign Up)
        if (!user) {
          user = await User.create({
            phone: phone,
            name: "Quickzy User", // Default name
            address: { text: "", lat: 0, lng: 0, zone: "" }, // Empty structure
            cart: [],
            orders: [],
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Sync DB data to the session so the UI can access it
      const dbUser = await User.findOne({
        phone: session.user.phone || session.user.email,
      });
      if (dbUser) {
        session.user.id = dbUser._id;
        session.user.name = dbUser.name;
        session.user.phone = dbUser.phone;
        session.user.address = dbUser.address;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.phone;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // Redirect to home if there's an issue
  },
});

export { authoptions as GET, authoptions as POST };
