import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import UserEditProfile from "./UserEditprofile"
import {auth}from "@/lib/auth"

export default async function UserProfile() {
    const session = await auth()
    return (

        <Dialog>
            <DialogTrigger className=" w-full text-left px-2 py-1 cursor pointer hover:bg-muted-foreground/5">
                profile
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Profile
                    </DialogTitle>
                    <DialogDescription>edit your profile </DialogDescription>

                </DialogHeader>
                <UserEditProfile
            firstName ={session?.user.firstName}
            lastName ={session?.user.lastName}
            email ={session?.user.email}
            currency={session?.user.currency}
            
            
            />

            </DialogContent>
            
        </Dialog>

    )
}