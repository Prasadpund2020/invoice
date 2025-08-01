// app/actions/logoutAction.ts
"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
  const cookieStore = cookies();

  // Expire the admin-auth cookie
  (await
    // Expire the admin-auth cookie
    cookieStore).set("admin-auth", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  // You can omit redirect if you handle it on the client
}
