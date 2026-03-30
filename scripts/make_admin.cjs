require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  role: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function makeAdmin() {
  const targetEmail = process.argv[2];
  if (!targetEmail) {
    console.log("Usage: node scripts/make_admin.cjs <email>");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB!");
  
  const user = await User.findOneAndUpdate(
    { email: targetEmail }, 
    { role: "admin" },
    { new: true }
  );

  if (user) {
    console.log(`Success! ${user.email} is now an admin.`);
  } else {
    console.log(`Error: User with email '${targetEmail}' not found in the database. Please ensure they have logged in at least once.`);
  }
  
  process.exit(0);
}

makeAdmin();
