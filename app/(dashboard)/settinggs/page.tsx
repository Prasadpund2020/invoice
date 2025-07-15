"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import imagebase64 from "@/lib/imagebase64"
import toast from 'react-hot-toast';



type TSignatureData = {
    name: string,
    image: string
}

export default function SettingPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [logo, setLogo] = useState<string>()
    const [signatureData, setsignatureData] = useState<TSignatureData>({
        name: "",
        image: ""
    })

    const onChangeSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setsignatureData((preve) => ({
            ...preve,
            [name]: value
        }))
    }

    const handleSignatureImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length <= 0) return
        const file = files[0]
        if (!["image/png", "image/jpeg"].includes(file.type)) {
            alert("Please upload a PNG or JPEG file.")
            return
        }
        const image = await imagebase64(file)
        setsignatureData((preve) => ({
            ...preve,
            image: image
        }))
    }

    const handleOnChangeLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length <= 0) return
        const file = files[0]
        if (!["image/png", "image/jpeg"].includes(file.type)) {
            alert("Please upload a PNG or JPEG file.")
            return
        }
        const image = await imagebase64(file)
        setLogo(image)
    }

    const fetchData = async () => {
        try {
            const response = await fetch('/api/settinggs')
            const responseData = await response.json()
            if (response.status === 200) {
                setLogo(responseData?.data?.invoiceLogo)
                setsignatureData(responseData?.data?.signature || { name: "", image: "" })
            }

        } catch (error) {
            console.log(error)

        }
    }

    useEffect(() => {
        fetchData()

    }, [])
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, data: { logo?: string | undefined, signature?: TSignatureData | undefined}) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch("/api/settinggs", {
                method: 'POST',
                body: JSON.stringify(data)
            });
            if (response.status === 200) {
                toast.success("Settings updated successfully");
                fetchData();
            }
        } 
       catch (error: unknown) {
    if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error("Something went wrong..");
    }
} finally {
    setIsLoading(false);
}
    };

    return (
        <div className="p-4">
            <h1 className="font-semibold text-xl mb-4">Settings</h1>
            <Accordion type="single" className="space-y-4">
                {/* Invoice Logo Section */}
                <AccordionItem value="Invoice-Logo">
                    <AccordionTrigger className="font-semibold text-base cursor-pointer">Invoice Logo</AccordionTrigger>
                    <AccordionContent>
                        <form className="space-y-4 max-w-xs" onSubmit={(e) => handleSubmit(e, { logo })}>
                            {/* Added label for clarity */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">Upload Invoice Logo</label>
                                {/* 👇 changed bg-primary to bg-muted for mild color */}
                                <Input
                                    type="file"
                                    onChange={handleOnChangeLogo}
                                    className="w-full file:cursor-pointer file:bg-muted file:text-foreground file:border-none file:px-4 file:py-2"
                                />
                            </div>
                            <div className="rounded-lg border border-dashed p-2 flex justify-center items-center bg-muted">
                                {logo ? (
                                    <Image
                                        className="aspect-video h-20 object-contain"
                                        src={logo}
                                        width={250}
                                        height={96}
                                        alt="Uploaded invoice logo preview"
                                    />
                                ) : (
                                    <p className="text-center text-muted-foreground">No Logo</p>
                                )}
                            </div>
                            <Button className="w-full" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                        </form>
                    </AccordionContent>
                </AccordionItem>

                {/* Signature Section */}
                <AccordionItem value="Signnature-invoice">
                    <AccordionTrigger className="font-semibold text-base cursor-pointer">Invoice Signature</AccordionTrigger>
                    <AccordionContent>
                        <form className="space-y-4 max-w-xs" onSubmit={(e) => handleSubmit(e, { signature: signatureData })}
                        >
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">Signature Name</label>
                                <Input
                                    type="text"
                                    placeholder="Enter your Signature name"
                                    value={signatureData.name}
                                    onChange={onChangeSignature}
                                    name="name"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">Upload Signature Image</label>
                                {/* 👇 changed bg-primary to bg-muted for mild color */}
                                <Input
                                    type="file"
                                    onChange={handleSignatureImage}
                                    className="w-full file:cursor-pointer file:bg-muted file:text-foreground file:border-none file:px-4 file:py-2"
                                />
                            </div>
                            <div className="rounded-lg border border-dashed p-2 flex justify-center items-center bg-muted">
                                {signatureData.image ? (
                                    <Image
                                        className="aspect-video h-20 object-contain"
                                        src={signatureData.image}
                                        width={250}
                                        height={96}
                                        alt={signatureData.name || "Signature preview"}
                                    />
                                ) : (
                                    <p className="text-center text-muted-foreground">No Signature</p>
                                )}
                            </div>
                            <Button className="w-full">Save</Button>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
