import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/db/mongodbClient";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, // Merges Google and Email accounts automatically
    }),
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: email,
            subject: "Sign in to Quickzy",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; rounded: 15px;">
                <h1 style="color: #3BB77E; text-align: center;">Welcome to Quickzy</h1>
                <p style="font-size: 16px; color: #253D4E;">Click the button below to sign in to your accounts. Fast, fresh, and delivered in a zap!</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" style="background-color: #3BB77E; color: white; padding: 15px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px;">Sign in to Quickzy</a>
                </div>
                <p style="font-size: 12px; color: #999; text-align: center;">If you did not request this email, you can safely ignore it.</p>
              </div>
            `,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(JSON.stringify(error));
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/", // We use our modal on the home page
    error: "/", // Redirect back to home on error
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
