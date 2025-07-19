import DashboardSidebar from "@/app/admin/dashboard/_Components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 p-6 w-full max-w-screen-2xl mx-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
