"use client";

import "@/app/styles/SignUp_LogIn_Form.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onboardingSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { currencyOption } from "@/lib/utils";
import Image from "next/image";


export default function OnboardingPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      currency: "USD",
      address1: "",
      address2: "",
      address3: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>();
  const [signatureData, setSignatureData] = useState({ name: "", image: "" });
  const router = useRouter();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Please upload a PNG or JPEG file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setValue("logo", data.url);
        setLogoPreview(data.url);
      } else {
        alert(data.error || "Logo upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Logo upload error.");
    }
  };

  const handleSignatureImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Please upload a PNG or JPEG file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSignatureData((prev) => ({
          ...prev,
          image: data.url,
        }));
      } else {
        alert(data.error || "Signature upload failed.");
      }
    } catch (error) {
      console.error("Signature upload error:", error);
      alert("Signature upload error.");
    }
  };

  const onChangeSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignatureData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
    try {
      setIsLoading(true);

      const {
        address1,
        address2,
        address3,
        ...settingFields
      } = data;

      const response = await fetch("/api/settinggs", {
        method: "POST",
        body: JSON.stringify({
          ...settingFields,
          signature: signatureData,
          streetAddress: address1,
          city: address2,
          postalCode: address3,
        }),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (response.status === 200) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="form-box" style={{ width: "100%", textAlign: "left", overflowY: "auto" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Complete Your Profile</h1>
            <p>Provide your details to finish onboarding.</p>

            <div className="input-box">
              <input placeholder="First Name" {...register("firstName")} disabled={isLoading} />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>

            <div className="input-box">
              <input placeholder="Last Name" {...register("lastName")} disabled={isLoading} />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>

            <div className="input-box">
              <select
                className="input"
                onChange={(e) => setValue("currency", e.target.value)}
                defaultValue="USD"
                disabled={isLoading}
              >
                {Object.keys(currencyOption).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-box">
              <input placeholder="Mobile Number" {...register("phone")} disabled={isLoading} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div className="input-box">
              <input placeholder="Address Line 1" {...register("address1")} disabled={isLoading} />
            </div>
            <div className="input-box">
              <input placeholder="Address Line 2" {...register("address2")} disabled={isLoading} />
            </div>
            <div className="input-box">
              <input placeholder="Address Line 3" {...register("address3")} disabled={isLoading} />
            </div>

            <div className="input-box">
              <label>Upload Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isLoading} />
              {logoPreview && (
                <Image
                  src={logoPreview}
                  alt="Logo"
                  width={120}
                  height={60}
                  style={{ marginTop: 10, objectFit: "contain" }}
                />
              )}            </div>

            <div className="input-box">
              <input
                type="text"
                placeholder="Signature Name"
                name="name"
                value={signatureData.name}
                onChange={onChangeSignature}
                disabled={isLoading}
              />
            </div>

            <div className="input-box">
              <label>Upload Signature</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureImage}
                disabled={isLoading}
              />
              {signatureData.image && (
                <Image
                  src={signatureData.image}
                  alt="Signature"
                  width={120}
                  height={60}
                  style={{ marginTop: 10, objectFit: "contain" }}
                />
              )}

            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Please wait..." : "Finish Onboarding"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
