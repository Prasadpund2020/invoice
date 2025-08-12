// components/AddProductForm.tsx
"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function AddProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", description: "", price: 0, quantity: 1, total: 0 });

  useEffect(() => {
    setForm((prev) => ({ ...prev, total: prev.quantity * prev.price }));
  }, [form.quantity, form.price]);

  const handleChange = (field: string, value: any) => {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="border p-2 w-full"
        required
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        className="border p-2 w-full"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => handleChange("price", Number(e.target.value))}
        className="border p-2 w-full"
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => handleChange("quantity", Number(e.target.value))}
        className="border p-2 w-full"
        required
      />
      <input
        type="number"
        value={form.total}
        readOnly
        className="border p-2 w-full bg-gray-100"
      />
      <Button type="submit">Add Product</Button>
    </form>
  );
}
