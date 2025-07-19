"use client"
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Logo from "@/components/Logo"
import { SidebarContent } from "@/components/ui/sidebar"
import Link from 'next/link';
import { BookAIcon, LayoutDashboardIcon } from 'lucide-react';
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"; // ✅ If using shadcn or similar setup
import { Settings } from 'lucide-react'; // ✅ Correct import



export default function AdminDashboardSidebar() {
    const pathname = usePathname()
    return (
        <Sidebar>
            <SidebarHeader>
                <Logo />

            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/dashboard" className={cn(pathname === "/admin/dashboard" && "bg-white")}>
                                <LayoutDashboardIcon />
                                <span>
                                    Admin Dashboard
                                </span>
                            </Link>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/admin/dashboard/users"} className={""}>
                                <BookAIcon />
                                <span>
                                    User List
                                </span>
                            </Link>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                </SidebarMenu>

            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/settinggs"} className={cn(pathname === "/settinggs" && "bg-white")}>
                                <Settings />
                                <span>
                                    settings
                                </span>
                            </Link>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
               
            </SidebarFooter>


        </Sidebar>



    )

}