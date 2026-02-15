import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const { address, lat, lng } = await req.json();
    if (!address) {
      return NextResponse.json({ error: "Address missing" }, { status: 400 });
    }

    await connectDb();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { address: { text: address, lat, lng } } },
      { new: true },
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
