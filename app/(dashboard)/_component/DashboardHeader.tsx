import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/user.model";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserProfileDropDown from "./UserProfileDropdown";

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
    relative
  "
      style={{
        background: 'linear-gradient(90deg, rgba(41, 128, 185, 0.7), rgba(109, 213, 250, 0.6), rgba(255, 255, 255, 0.4))'
      }}
    >
      {/* Glow blur layer */}
      <div
        className="glow-blur"
        style={{
          content: "''",
          position: 'absolute',
          bottom: '-100px',
          left: '0',
          background: 'radial-gradient(ellipse at bottom, #2687c9, #6dd5fa, #ffffff)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <SidebarTrigger />
      <div className="relative z-10">
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
