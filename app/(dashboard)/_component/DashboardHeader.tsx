import{auth }from "@/lib/auth";
import UserProfileDropDown from "./UserProfileDropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";


export default  async function DashboardHeader(){
    const session =await auth();
    return (
      <header  className="
    sticky top-0 z-50
    h-14 w-full
    bg-blue-200/30
    backdrop-blur-md
    border-b border-blue-300/30
    shadow
    flex items-center
    px-4
  ">


        <SidebarTrigger/>
        <div>
            welcome
            <span className="font-semibold ">
            <span> {session?.user.firstName ?? "-"} </span>
            {" "}
            <span> {session?.user.lastName ?? "-"} </span>
            </span>
        </div>
        <div className ="ml-auto w-fit">
            <UserProfileDropDown

            isArrowUp ={false}
            isFullName ={false}
            
            />

        </div>

       </header>



    )
}