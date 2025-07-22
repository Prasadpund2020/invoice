"use client";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import Link from "next/link";
import { BookAIcon, LayoutDashboardIcon, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import AdminProfileDropDown from "@/app/admin/dashboard/_Components/adminProfileDropdown";

export default function AdminDashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="flex flex-col justify-between h-screen">
      <div className="flex flex-col flex-1">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>

        <SidebarContent className="p-2 flex flex-col gap-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/dashboard"
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 rounded",
                    pathname === "/admin/dashboard" && "bg-white"
                  )}
                >
                  <LayoutDashboardIcon className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/dashboard/users"
                  className="flex items-center gap-2 w-full px-3 py-2 rounded"
                >
                  <BookAIcon className="w-4 h-4" />
                  <span>User List</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </div>

      <SidebarFooter className="flex flex-col gap-4 p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/dashboard/settings"
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded",
                  pathname === "/admin/dashboard/settings" && "bg-white"
                )}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Admin Profile Dropdown clearly visible */}
        <AdminProfileDropDown />
      </SidebarFooter>
    </Sidebar>
  );
}
