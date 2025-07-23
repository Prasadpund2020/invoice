// scripts/seed-admin.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // ✅ load .env.local manually

import { connectDB } from "@/lib/connectDB";
import Admin from "@/models/admin.model";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  await connectDB();

  const existingAdmin = await Admin.findOne({ email: "admin@example.com" });
  if (existingAdmin) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Admin.create({
    email: "admin@example.com",
    password: hashedPassword,
  });

  console.log("✅ Admin created successfully");
}

seedAdmin().then(() => process.exit(0)).catch(console.error);
