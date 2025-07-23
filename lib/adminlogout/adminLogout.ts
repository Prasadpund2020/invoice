"use server";

import { signOut } from "@/lib/auth"; // or from "next-auth"
import { redirect } from "next/navigation";

export async function logoutAction() {
  await signOut(); // Server-side signOut (next-auth v4+ with custom setup)
  redirect("/admin"); // Redirect after logout
}
