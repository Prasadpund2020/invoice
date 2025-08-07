import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/user.model";
import UserProfileDropDown from "./UserProfileDropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function DashboardHeader() {
  const session = await auth();
  await connectDB();
  const user = await UserModel.findById(session?.user.id);

  return (
    <header
      className="
    sticky top-0 z-50
    h-14 w-full
    backdrop-blur-md
    border-b border-blue-300/30
    shadow
    flex items-center
    px-4
  "
style={{ backgroundColor: '#7494ec' }}
    >
      <SidebarTrigger />
      <div>
        welcome
        <span className="font-semibold">
          <span> {user?.firstName ?? "-"} </span>{" "}
          <span> {user?.lastName ?? "-"} </span>
        </span>
      </div>
      <div className="ml-auto w-fit">
        <UserProfileDropDown isArrowUp={false} isFullName={false} />
      </div>
    </header>
  );
}
