import { connectDB } from "@/lib/connectDB";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function DashboardHeader() {
  await connectDB();

  return (
    <header
      className="
        sticky top-0 z-50
        h-14 w-full
        bg-blue-200/30
        backdrop-blur-md
        border-b border-blue-300/30
        shadow
        flex items-center
        px-4
      "
    >
      <SidebarTrigger />
      <div>
        welcome
        <span className="font-semibold">
          <span> { "Admin"} </span>{" "}
        </span>
      </div>
      
    </header>
  );
}
