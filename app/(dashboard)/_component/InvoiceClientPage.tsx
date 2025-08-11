"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { IInvoice } from "@/models/invoice.model";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { DataTable } from "@/components/ui/DataTable";
import { MoreVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { useCallback } from "react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface IInvoiceClientPage {
    currency: string | undefined;
    userId: string | undefined;
}

export default function InvoiceClientPage({ currency, userId }: IInvoiceClientPage) {
    const [data, setData] = useState<IInvoice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/invoice?page=${page}`);
            const responseData = await response.json();
            if (response.ok) {
                setData(responseData.data || []);
                setTotalPage(responseData.totalPage || 1);
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching invoices");
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleDeleteInvoice = async (invoiceId: string, userId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this invoice?");
        if (!confirmed) return;

        const prevData = [...data];
        // Optimistic UI update
        setData((prev) => prev.filter((invoice) => invoice._id?.toString() !== invoiceId));

        try {
            const res = await fetch(`/api/invoice/${userId}/${invoiceId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete invoice");
            }

            toast.success("Invoice deleted successfully");

            // Optional: Refetch to ensure pagination is correct
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Error deleting invoice");
            // Rollback
            setData(prevData);
        }
    };

    const columns: ColumnDef<IInvoice>[] = [
        { accessorKey: "invoice_no", header: "Invoice No" },
        {
            accessorKey: "to.name",
            header: "Client Name",
            cell: ({ row }) => row.original.to.name,
        },
        {
            accessorKey: "invoice_date",
            header: "Date",
            cell: ({ row }) => format(row.original.invoice_date, "PPP"),
        },
        {
            accessorKey: "due_date",
            header: "Due",
            cell: ({ row }) => format(row.original.due_date, "PPP"),
        },
        {
            accessorKey: "total",
            header: "Amount",
            cell: ({ row }) =>
                new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency,
                }).format(row.original.total),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                const statusStyles =
                    status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : status === "PENDING"
                            ? "bg-red-100 text-red-700"
                            : status === "CANCEL"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-muted text-muted-foreground";
                return <Badge className={statusStyles}>{status}</Badge>;
            },
        },
        {
            accessorKey: "_id",
            header: "Action",
            cell: ({ row }) => {
                const invoiceId = row.original._id?.toString();
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/api/invoice/${userId}/${invoiceId}`)}>
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/invoice/edit/${invoiceId}`)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/invoice/paid/${invoiceId}`)}>
                                Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeleteInvoice(invoiceId as string, userId as string)}
                                className="text-red-500"
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
                <h1 className="text-xl font-semibold">Invoice</h1>
                <Link
                    href="/invoice/create"
                    className={cn(buttonVariants(), "cursor-pointer btn-gradient-faint")}
                >
                    Create Invoice
                </Link>

            </div>

            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <DataTable columns={columns} data={data} />
                    {totalPage > 1 && (
                        <div className="my-5">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" onClick={() => setPage(1)} />
                                    </PaginationItem>
                                    {new Array(totalPage).fill(null).map((_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink href="#" onClick={() => setPage(index + 1)}>
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext href="#" onClick={() => setPage(totalPage)} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
