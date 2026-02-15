import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/db/mongodbClient";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

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
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "x-sib-api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "Quickzy",
              email: "pjha91275@gmail.com", // Must be your verified Brevo email
            },
            to: [{ email }],
            subject: "Sign in to Quickzy",
            htmlContent: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <!-- Hero Banner -->
                <div style="background-color: #3BB77E; padding: 0; text-align: center;">
                  <img src="${process.env.NEXT_PUBLIC_URL}/footer_banner.png" alt="Quickzy Banner" style="width: 100%; max-height: 200px; object-fit: cover;">
                </div>
                
                <div style="padding: 40px 30px; text-align: center;">
                  <!-- Logo & Branding -->
                  <div style="margin-bottom: 25px;">
                    <img src="${process.env.NEXT_PUBLIC_URL}/logo.png" alt="Quickzy Logo" style="width: 60px; height: 60px; margin-bottom: 10px;">
                    <h1 style="color: #253D4E; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">Quickzy</h1>
                    <p style="color: #7E7E7E; margin: 5px 0 0 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Fast. Fresh. Delivered in a Zap.</p>
                  </div>

                  <h2 style="color: #253D4E; font-size: 22px; font-weight: 800; margin-bottom: 15px;">Login to your account</h2>
                  <p style="font-size: 16px; color: #4B5563; line-height: 1.6; margin-bottom: 30px;">
                    You're just one step away from fresh groceries delivered to your doorstep. Click the button below to sign in securely.
                  </p>

                  <!-- CTA Button -->
                  <div style="margin: 35px 0;">
                    <a href="${url}" style="background-color: #3BB77E; color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 18px; display: inline-block; box-shadow: 0 10px 20px rgba(59, 183, 126, 0.2);">Sign In to Quickzy</a>
                  </div>

                  <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee; text-align: left;">
                    <h4 style="color: #253D4E; margin-bottom: 10px; font-size: 14px; font-weight: 800; text-transform: uppercase;">How it works:</h4>
                    <ul style="color: #7E7E7E; font-size: 13px; padding-left: 20px; line-height: 1.8;">
                      <li>Click the green button above to open our website.</li>
                      <li>You will be logged in automatically on your device.</li>
                      <li>Start adding fresh items to your cart!</li>
                    </ul>
                  </div>
                </div>

                <!-- Footer Info -->
                <div style="background-color: #f9f9f9; padding: 25px; text-align: center; border-top: 1px solid #eee;">
                  <p style="font-size: 11px; color: #9CA3AF; line-height: 1.6; margin: 0;">
                    Quickzy Fresh Groceries © 2026<br>
                    You are receiving this because you requested a login link.<br>
                    If you did not request this, please ignore this email.
                  </p>
                </div>
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
      if (token && session.user) {
        session.user.id = token.sub;

        await connectDb();
        const dbUser = await User.findById(token.sub).lean();
        if (dbUser) {
          session.user.name = dbUser.name;
          session.user.phone = dbUser.phone;
          session.user.address = dbUser.address;
        }
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
  events: {
    // When a user is created via Google, mark their email as verified immediately
    async createUser({ user }) {
      await connectDb();
      await User.findByIdAndUpdate(user.id, { emailVerified: new Date() });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
