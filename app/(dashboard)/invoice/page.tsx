import { Suspense } from "react";
import InvoiceClientPage from "../_component/InvoiceClientPage";
import {auth} from "@/lib/auth"
import Loading from "@/components/Loading"





export default async function InvoicePage(){
    const session =await auth();
    return(
        <Suspense fallback={<Loading/>}>
        <InvoiceClientPage userId={session?.user.id} currency={session?.user.currency}/>
        </Suspense>
    )



}