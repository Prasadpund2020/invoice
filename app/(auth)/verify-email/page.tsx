"use client"
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { ArrowLeft, MailIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";


export default function VerifyEmail(){
    const router = useRouter();
    return(
        <Card className="min-w-xs lg:min-w-sm">
            <CardHeader className=" flex flex-col gap-3 text-center">
                <div className ="bg-purple-100 text-purple-600 p-4 rounded-full mx-auto">
                <MailIcon className="size-12 "  />
                </div>
                <CardTitle className="text-xl w-full font-semibold">
                    Check your email</CardTitle>
                   <CardDescription >we have sent you a verification link to your email address..</CardDescription>
                

            </CardHeader>
            <CardContent className=" flex flex-col text-center">
                <div className="flex items-center gap-2 mb-4 bg-yellow-100 text-yellow-600 rounded-lg" >
                    <AlertCircle className="size-6 text-yellow-500" />
                    <span>
                        check your spam too.
                    </span>
                </div>
                <Button  onClick={()=>router.back()} className="w-full" variant="outline">
                    <ArrowLeft className="mr-2 size-4" />
                    back to login
                </Button>
            </CardContent>
    </Card>
              

    )
}