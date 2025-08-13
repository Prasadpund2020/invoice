// components/AddProductForm.tsx
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormData = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
};

export default function AddProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    quantity: 1, // ✅ default stays 1
    total: 0,
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, total: prev.quantity * prev.price }));
  }, [form.quantity, form.price]);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ ...form, total: undefined }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      toast.success("Product added");
      onSuccess();
    } else {
      toast.error("Failed to add product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 max-w-lg w-full bg-white p-6 rounded-xl shadow-md"
    >
      <div>
        <Label>Product Name</Label>
        <Input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Input
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Price</Label>
        <Input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
          required
        />
      </div>

      {/* ✅ Quantity with note */}
      <div>
        <Label>Quantity</Label>
        <Input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          readOnly // prevent editing here
          className="bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Quantity defaults to 1. You can change it while generating the invoice.
        </p>
      </div>

      <div>
        <Label>Total</Label>
        <Input
          type="number"
          value={form.total}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <Button
        type="submit"
        className={cn(buttonVariants(), "cursor-pointer btn-gradient-faint")}
      >
        Add Product
      </Button>
    </form>
  );
}
