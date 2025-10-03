import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/adminSchema.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);


// Save the admin in the database with profilePic pointing to the filename
await Admin.create({
  name: "Admin Jo",
  profilePic: "jovann.jpg",
  email: "skillconnect@gmail.com",
  password: "tanginamo",
  role: "Admin"
});

console.log("Admin seeded with profile pic");
process.exit();
