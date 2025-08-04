"use client"
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Logo from "@/components/Logo"
import { SidebarContent } from "@/components/ui/sidebar"
import Link from 'next/link';
import { BookAIcon, LayoutDashboardIcon } from 'lucide-react';
import {usePathname } from "next/navigation"
import { cn } from "@/lib/utils"; // ✅ If using shadcn or similar setup
import { Settings } from 'lucide-react'; // ✅ Correct import



export default function DashboardSidebar({children}:{children:React.ReactNode}) {
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
                            <Link href={"/dashboard"}  className ={cn(pathname ==="/dashboard"&& "bg-white")}>
                            <LayoutDashboardIcon/>
                            <span>
                                Dashboard
                            </span>
                            </Link>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/invoice"}  className ={cn(pathname ==="/invoice"&& "bg-white")}>
                            <BookAIcon/>
                            <span>
                                Invoice
                            </span>
                            </Link>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/addClient"}  className ={cn(pathname ==="/addClient"&& "bg-white")}>
                            <BookAIcon/>
                            <span>
                                Add client 
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
                            <Link href={"/settinggs"}  className ={cn(pathname ==="/settinggs"&& "bg-white")}>
                            <Settings/>
                            <span>
                                Update  settings
                            </span>
                            </Link>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {children}
            </SidebarFooter>


        </Sidebar>



    )

}