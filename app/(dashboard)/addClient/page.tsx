"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { IClient } from "@/models/clients";
import AddClientForm from "@/components/AddClientForm";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { ArrowLeft } from "lucide-react";

export default function ClientPage() {
  const [clients, setClients] = useState<IClient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (res.ok) {
        setClients(data || []);  // <-- data is an array directly
      } else {
        toast.error("Failed to load clients");
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const columns: ColumnDef<IClient>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address1", header: "Address 1" },
    { accessorKey: "address2", header: "Address 2" },
    { accessorKey: "address3", header: "Address 3" },
    {
      accessorKey: "createdAt",
      header: "Added",
      cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        {/* Show back arrow only when form is visible */}
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
          <h1 className="text-xl font-semibold">Clients</h1>
        </div>

        <Button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Hide Form" : "Add Client"}
        </Button>
      </div>

      {/* Center the form and hide table when form is open */}
      {showForm ? (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md">
            <AddClientForm onSuccess={() => {
              fetchClients();
              setShowForm(false);  // optionally hide form after successful add
            }} />
          </div>
        </div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <DataTable columns={columns} data={clients} />
      )}
    </div>
  );
}
