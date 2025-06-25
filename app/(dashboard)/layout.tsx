import ProtectedPage from '@/components/CheckAuth';
import  {SidebarProvider}  from '@/components/ui/sidebar';
import DashboardSidebar from './_component/dashboardSidebar';



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar/>
      {/**sidebar**/}
    <main>
      {children}
      <ProtectedPage/>
    </main>
    </SidebarProvider>
  )
}