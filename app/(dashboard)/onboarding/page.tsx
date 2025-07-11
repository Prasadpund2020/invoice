"use client";

import { Card, CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card'
import { CardTitle } from '@/components/ui/card'
import { CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { currencyOption } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { onboardingSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';





export default function OnboardingPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            currency: 'USD',
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
                router.push('/dashboard');
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
        <div className="flex items-center justify-center flex-col min-h-dvh h-dvh overflow-auto relative p-4">
            <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
            <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <Card className="min-w-xs lg:min-w-sm w-full max-w-sm relative z-10">
                <CardHeader>
                    <CardTitle>You are almost Finished </CardTitle>
                    <CardDescription>
                        Enter your  information  to create your account
                    </CardDescription>
                </CardHeader>

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
                        <Button disabled={isLoading}>
                            {
                                isLoading ? "please wait..." : "Finished Onboarding"
                            }
                        </Button>
                    </form>


                </CardContent>

            </Card>
        </div>
    );
}