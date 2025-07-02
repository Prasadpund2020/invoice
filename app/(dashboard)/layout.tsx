import ProtectedPage from '@/components/CheckAuth';
import  {SidebarProvider}  from '@/components/ui/sidebar';
import DashboardSidebar from './_component/dashboardSidebar';
import UserProfileDropDown from './_component/UserProfileDropdown';
import DashboardHeader from './_component/DashboardHeader';
import { Suspense } from 'react';



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar>
        <UserProfileDropDown

        isFullName
        isArrowUp
        
        />
      </DashboardSidebar>
      {/**sidebar**/}
    <main className="w-full relative">

      <DashboardHeader/>
      <Suspense fallback ={<p>loading...</p>}>
      {children}
      </Suspense>
      <ProtectedPage/>
    </main>
    </SidebarProvider>
  )
}