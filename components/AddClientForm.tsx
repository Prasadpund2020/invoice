"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  address1: z.string().min(1, "Address Line 1 is required"),
  address2: z.string().min(1, "Address Line 2 is required"),
  address3: z.string().min(1, "Address Line 3 is required"),
});

export default function AddClientForm({ onSuccess }: { onSuccess?: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof ClientSchema>>({
    resolver: zodResolver(ClientSchema),
  });

  const onSubmit = async (data: z.infer<typeof ClientSchema>) => {
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Client added successfully");
        reset();
        onSuccess?.(); // ✅ refresh the list
      } else {
        toast.error(result.message || "Failed to add client");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 max-w-lg w-full bg-white p-6 rounded-xl shadow-md">
      <div>
        <Label>Client Name</Label>
        <Input placeholder="Client name" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <Label>Email</Label>
        <Input placeholder="Email" {...register("email")} />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <Label>Address 1</Label>
        <Input placeholder="Bldg / Flat / Shop No." {...register("address1")} />
        {errors.address1 && <p className="text-xs text-red-500">{errors.address1.message}</p>}
      </div>
      <div>
        <Label>Address 2</Label>
        <Input placeholder="Street name / Landmark" {...register("address2")} />
        {errors.address2 && <p className="text-xs text-red-500">{errors.address2.message}</p>}
      </div>
      <div>
        <Label>Address 3</Label>
        <Input placeholder="City / State / Country / Pincode" {...register("address3")} />
        {errors.address3 && <p className="text-xs text-red-500">{errors.address3.message}</p>}
      </div>
      <Button type="submit">Add Client</Button>
    </form>
  );
}
