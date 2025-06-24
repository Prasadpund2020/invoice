import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {signIn } from "@/lib/auth";
import SubmitButton from "@/components/SubmitButton";
import { auth } from "@/lib/auth";

export default  async function  LoginPage(){
    const session = await auth()


    return(
    <Card className="max-w-sm min-w-xs lg:min-w-sm">
       <CardHeader>
       
        <CardTitle className ="text-xl w-full" >login</CardTitle>
        <CardDescription> Enter your credentials to access your account</CardDescription>
       </CardHeader>
       <CardContent>
        <form 
        className ="grid gap-4"
        action={async(formdata)=>{
            "use server";
           await signIn("resend",formdata)

        }}>
            <div className="grid gap-2">
                <Label>email</Label>
                <Input className =" mt-2" placeholder="hello@xyz.com"
                required 
                type ="email"
                name="email"/>
            </div>
            <SubmitButton title="login" />
        </form>
       </CardContent>
   
    
    </Card>

    )
}
