import DashboardSidebar from "@/app/admin/dashboard/_Components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from '@/app/admin/dashboard/_Components/adminDashboardHeader';


export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        
        <main className="flex-1  w-full max-w-screen-2xl mx-auto">
                    <DashboardHeader />
          
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
