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


export default function OnboardingPage() {
    const {}= useForm<z.infer<typeof onboardingSchema>>()
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
                    <form className="grid gap-4">
                        <div className="grid gap-4">
                            <label>First name</label>
                            <input
                                placeholder="joe"
                                type="text">
                            </input>
                        </div>
                        <div className="grid gap-4">
                            <label>Last  name</label>
                            <input
                                placeholder="biden"
                                type="text">
                            </input>
                        </div>
                        <div className="grid gap-2 " >
                            <label>Select currency </label>
                            <Select >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        Object.keys(currencyOption).map((item: string, index: number) => {
                                            return (
                                                <SelectItem className=" side-bottom" key={item} value={item}>{item}</SelectItem>
                                            )

                                        })
                                    }


                                </SelectContent>
                            </Select>
                        </div>
                        <Button>Finished Onboarding</Button>
                    </form>


                </CardContent>

            </Card>
        </div>
    );
}