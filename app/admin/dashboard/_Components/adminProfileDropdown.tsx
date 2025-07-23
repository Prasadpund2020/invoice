"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react"; // 👈 use client version

export default function AdminProfileDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full p-2 text-left border rounded text-sm">
          Admin Menu ▼
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full min-w-[200px]">
        <DropdownMenuItem disabled className="opacity-70 cursor-default">
          Reserved
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ redirect: true, callbackUrl: "/admin" })}
          className="text-red-500 hover:bg-red-100 font-medium cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
