"use client"
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { onboardingSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {Card,CardContent,} from '@/components/ui/card';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import {currencyOption} from "@/lib/utils"



interface UserEditProfile{
    firstName :string|undefined;
    lastName :string|undefined;
    email :string|null|undefined ;
    currency: string|undefined;

}



export default  function UserEditProfile({firstName,lastName,email,currency}: UserEditProfile){

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof onboardingSchema>>({
            resolver: zodResolver(onboardingSchema),
            defaultValues: {
        
                firstName: firstName ,
                lastName: lastName ,
                currency :currency,
                
            }
        })
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const router = useRouter();
        const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
            console.log(data);
            try {
                setIsLoading(true);
                const response = await fetch('/api/user', {
                    method: 'PUT',
                    body: JSON.stringify(data),
                })
    
                if (response.status === 200) {
                    router.refresh()
                }
    
    
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setIsLoading(false);
            }
        }
    return (
        <div className="flex flex-col items-start justify-start">
        
            <Card className="min-w-xs lg:min-w-sm w-full max-w-xl relative z-10">
                

                <CardContent>
                    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <label>First name</label>
                            <input
                                placeholder="joe"
                                type="text"
                                {...register("firstName", { required: true })}
                                disabled={isLoading} />
                            {
                                errors.firstName && (
                                    <p className="text-xs text-red-500">{errors.firstName.message}</p>
                                )
                            }
                        </div>
                        <div className="grid gap-4">
                            <label>Last  name</label>
                            <input
                                placeholder="biden"
                                type="text" {...register("lastName", { required: true })}
                                disabled={isLoading}/>
                            
                            {
                                errors.lastName && (
                                    <p className="text-sx text-red-500">{errors.lastName.message}</p>
                                )
                            }
                        </div>
                        <div className="grid gap-2 " >
                            <label >Select currency </label>
                            <Select defaultValue="USD" {...register("currency")}
                                disabled={isLoading}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        Object.keys(currencyOption).map((item: string) => {
                                            return (
                                                <SelectItem className=" side-bottom" key={item} value={item}>{item}</SelectItem>
                                            )

                                        })
                                    }


                                </SelectContent>

                            </Select>
                            </div>
                            <div className="grid gap-4">
                            <label>Email</label>
                            <input
                                placeholder="example@gmail,com"
                                type="email" required
                                disabled={true}
                                value={email ?? ""}/>
                        </div>
                        <Button disabled={isLoading}>
                            {
                                isLoading ? "please wait..." : "Update Profile"
                            }
                        </Button>
                    </form>


                </CardContent>

            </Card>
        </div>
    );
}
    
        