import { auth } from "@/lib/auth"; 
import { redirect } from "next/navigation";
//component for proected page
export default async function ProtectedPage() {
    const session = await auth();
   // console.log("session",session)

    if(!session) {
        console.log("session not found")
       redirect("/login");

}return(
    <>
    </>
)
}


//component for unprotected page
export  async function UnprotectedPage() {
    const session = await auth();

    if(session) {
        if(!session.user.firstName || !session.user.lastName || !session.user.currency   )  {
            redirect("/onboarding")

        }else{
             redirect("/dashboard")}
        }
       
    return (
        <>
        </>
        );
}