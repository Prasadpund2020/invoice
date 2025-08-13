// app/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { IProduct } from "@/models/products";
import AddProductForm from "@/components/AddProductForm";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data || []);
      } else {
        toast.error("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const prevProducts = [...products];
    setProducts((prev) => prev.filter((p) => p._id !== productId));

    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });

      if (res.ok) {
        toast.success("Product deleted successfully");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete product");
        setProducts(prevProducts);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
      setProducts(prevProducts);
    }
  };

  const columns: ColumnDef<IProduct>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "quantity", header: "Quantity" },
    {
      accessorKey: "createdAt",
      header: "Added",
      cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const productId = row.original._id;
        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(productId)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {showForm && (
            <button
              onClick={() => setShowForm(false)}
              aria-label="Back"
              className="p-1 rounded hover:bg-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-xl font-semibold">Products</h1>
        </div>

        <Button
          className={cn(buttonVariants(), "cursor-pointer btn-gradient-faint")}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Hide Form" : "Add Product"}
        </Button>
      </div>

      {showForm ? (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md">
            <AddProductForm
              onSuccess={() => {
                fetchProducts();
                setShowForm(false);
              }}
            />
          </div>
        </div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <DataTable columns={columns} data={products} />
      )}
    </div>
  );
}
