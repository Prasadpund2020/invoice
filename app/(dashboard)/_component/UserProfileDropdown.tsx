import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { auth } from "@/lib/auth"
import getAvatarName from "@/lib/getAvatar"
import { ChevronDown } from "lucide-react"
import { signOut } from "@/lib/auth"
import UserProfile from "@/app/(dashboard)/_component/UserProfile"


interface IUserProfileDropdown {
  isFullName: boolean,
  isArrowUp: boolean,

}

export default async function UserProfileDropDown({ isFullName, isArrowUp }: IUserProfileDropdown) {


  const session = await auth()


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar className="border size-9 bg-neutral-300 cursor-pointer ">
            <AvatarImage src={session?.user.image as string} />
            <AvatarFallback>
              {getAvatarName(
                session?.user.firstName as string,
                session?.user.lastName as string
              )}
            </AvatarFallback>
          </Avatar>
          {
            isFullName && (
              <div>
                <p className="text-sm font-medium line-clamp-1">
                  <span>{session?.user.firstName}</span>{" "}
                  <span>{session?.user.lastName}</span>
                </p>
              </div>

            )


          }

          {
            isArrowUp && (
              <ChevronDown className="w-4 h-4 transition-all   ml-auto" />


            )



          }

        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full min-w-[250px]">
        <DropdownMenuLabel>
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserProfile />
        <DropdownMenuItem onClick={async () => {
          "use server"

          await signOut()


        }} className="bg-red-50 text-red-500 hover:bg-red-100 font-medium curosr-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}