require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  role: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB!");
  
  // Replace with the user's actual email or just update the first user
  const user = await User.findOneAndUpdate(
    {}, 
    { role: "admin" },
    { new: true, sort: { createdAt: 1 } }
  );

  if (user) {
    console.log(`Successfully made ${user.email} an admin!`);
  } else {
    console.log(`No users found in database.`);
  }
  
  process.exit(0);
}

makeAdmin();
