"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { currencyOption } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { onboardingSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import imagebase64 from '@/lib/imagebase64';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function OnboardingPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      currency: 'USD',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>();
  const [signatureData, setSignatureData] = useState({
    name: '',
    image: '',
  });

  const router = useRouter();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Please upload a PNG or JPEG file.');
      return;
    }

    const base64 = await imagebase64(file);
    setValue('logo', base64);
    setLogoPreview(base64);
  };

  const handleSignatureImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Please upload a PNG or JPEG file.');
      return;
    }

    const base64 = await imagebase64(file);
    setSignatureData((prev) => ({
      ...prev,
      image: base64,
    }));
  };

  const onChangeSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignatureData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settinggs', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          signature: signatureData,
        }),
      });

      if (response.status === 200) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative bg-white">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 z-[-2] h-full w-full bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
      <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Onboarding Card */}
      <Card className="min-w-xs lg:min-w-sm w-full max-w-sm max-h-[95vh] overflow-auto z-10">
        <CardHeader>
          <CardTitle>You are almost Finished</CardTitle>
          <CardDescription>Enter your information to create your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <label htmlFor="firstName">First name</label>
              <input
              id="firstName" 
                placeholder="Joe"
                autoComplete="given-name"
                type="text"
                {...register('firstName', { required: true })}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="lastName">Last name
                
              </label>
              <input
                id="lastName"
                placeholder="Biden"
                type="text"
                  autoComplete="family-name"
                {...register('lastName', { required: true })}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="currency">Select currency</label>
              <input type="hidden" {...register('currency')} />

              <Select
                defaultValue="USD"
                onValueChange={(value) => setValue('currency', value)}
                disabled={isLoading}
              >
                <SelectTrigger  id="currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger >
                <SelectContent>
                  {Object.keys(currencyOption).map((item: string) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="mobileNo">Mobile Number</label>
              <Input
                id="mobileNo"
                type="tel"
                placeholder="+1234567890"
                autoComplete="tel"
                {...register('phone', { required: true })}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>


            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="invoiceLogo">Upload Invoice Logo</label>
              <Input
                id="invoiceLogo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                autoComplete="off"
                className="w-full file:cursor-pointer file:bg-muted file:text-foreground file:border-none file:px-4 file:py-2"
                disabled={isLoading}
              />
              <div className="rounded-lg border border-dashed p-2 flex justify-center items-center bg-muted">
                {logoPreview ? (
                  <Image
                    className="aspect-video h-20 object-contain"
                    src={logoPreview}
                    width={250}
                    height={96}
                    alt="Uploaded invoice logo preview"
                  />
                ) : (
                  <p className="text-center text-muted-foreground">No Logo</p>
                )}
              </div>
              {errors.logo && (
                <p className="text-xs text-red-500">{errors.logo.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="signatureName">Signature Name</label>
              <Input
                id="signatureName"
                type="text"
                placeholder="Enter your signature name"
                name="name"
                autoComplete="off"
                value={signatureData.name}
                onChange={onChangeSignature}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="image">Upload Signature Image</label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleSignatureImage}
                
                className="w-full file:cursor-pointer file:bg-muted file:text-foreground file:border-none file:px-4 file:py-2"
                disabled={isLoading}
              />
              <div className="rounded-lg border border-dashed p-2 flex justify-center items-center bg-muted">
                {signatureData.image ? (
                  <Image
                    className="aspect-video h-20 object-contain"
                    src={signatureData.image}
                    width={250}
                    height={96}
                    alt="Signature preview"
                  />
                ) : (
                  <p className="text-center text-muted-foreground">No Signature</p>
                )}
              </div>
            </div>

            <Button disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Finished Onboarding'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
