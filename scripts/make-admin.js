import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Please define the MONGO_URI environment variable inside .env.local");
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  email: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email. Example: node scripts/make-admin.js admin@example.com");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (user) {
      console.log(`Success! ${email} is now an admin.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
