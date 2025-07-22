"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/adminlogout/adminLogout";

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

                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="w-full text-left bg-red-50 text-red-500 hover:bg-red-100 font-medium cursor-pointer px-2 py-1"
                    >
                        Logout
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
