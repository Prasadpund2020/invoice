"use client"

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { IInvoice } from "@/models/invoice.model"
import toast from "react-hot-toast";
import Loading from "@/components/Loading"
import { DataTable } from '@/components/ui/DataTable';
import { MoreVertical } from "lucide-react"
import { ColumnDef, } from "@tanstack/react-table"
import { format } from 'date-fns';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge"





interface IInvoiceClientPage {
    currency: string | undefined
    userId: string | undefined

}





export default function InvoiceClientPage({ currency, userId }: IInvoiceClientPage) {
    const [data, setdata] = useState<IInvoice[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [page, setPage] = useState<number>(1)
    const [totalPage, setTotalPage] = useState<number>(1)
    const router = useRouter();


    const fetchdata = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/invoice? page=${page}`)
            const responseData = await response.json()
            if (response.status === 200) {
                setdata(responseData.data || [])
                setTotalPage(responseData.totalPage || 1)

            } else {
                toast.error("something went wrong")
            }

        }
        catch (error: unknown) {
            console.log(error);
        }

        finally {
            setIsLoading(false)

        }

    }
    useEffect(() => {
        fetchdata()

    }, [page])

    const handleSendEmail = async (invoiceId: string, subject: string) => {
        try {
            toast.loading("please wait");
            const response = await fetch(`/api/email/${invoiceId}`, {
                method: "post",
                body: JSON.stringify({
                    subject: subject
                })
            })
            const responsedata= await response.json()

            if(response.status === 200){
                toast.success(responsedata.message)


            }

        } catch (error) {
            console.log(error)

        }
        finally {
            setTimeout(() => {
                toast.dismiss()
                
            }, 2000);
        }

    }

    const columns: ColumnDef<IInvoice>[] = [
        {
            accessorKey: "invoice_no",
            header: "Invoice No",
        },
        {
            accessorKey: "invoice_date",
            header: "date",
            cell: ({ row }) => {
                return format(row.original.invoice_date, "PPP")
            }
        }, {
            accessorKey: "due_date",
            header: "due",
            cell: ({ row }) => {
                return format(row.original.due_date, "PPP")
            }
        },
        {
            accessorKey: "to.name",
            header: "client name",
            cell: ({ row }) => {
                return format(row.original.due_date, "PPP")
            }
        },




        {
            accessorKey: "total",
            header: "Amount",
            cell: ({ row }) => {
                const totalAmountInCurrencyFormat = new Intl.NumberFormat("en-us", {
                    style: "currency",
                    currency: currency,
                }).format(row.original.total);
                return totalAmountInCurrencyFormat
            }
        },


        {
            accessorKey: "status",
            header: "status",
            cell: ({ row }) => {
                return <Badge>
                    {row.original.status}
                </Badge>
            }

        },
        {
            accessorKey: "_id",
            header: "Action",
            cell: ({ row }) => {
                const invoiceId = row.original._id?.toString()
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
                            <DropdownMenuItem onClick={()=>handleSendEmail(invoiceId as string,`Invoice From ${row.original.from.name}`)}>
                                Send Email
                            </DropdownMenuItem>
                        </DropdownMenuContent>


                    </DropdownMenu>
                )
            }

        }
    ];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
                <h1 className="text-xl font-semibold">Invoice </h1>
                <Link href={"/invoice/create"} className={cn(buttonVariants(), "cursor-pointer")}>
                    Create Invoice
                </Link>
            </div>
            {/*
            {
                data && data.length === 0 && !isLoading && (
                    <div className="min-h-60 h-full w-full bg-neutral-200 flex justify-center items-center rounded">
                        <div className="text-center">
                            <p className="font-semibold text-lg">No Invoice found...!!</p>
                            <p className="text-gray-500 text-sm mt-1">Create a new invoice to get started.</p>
                        </div>
                    </div>




                )
            }
                */}
            {
                isLoading ? <Loading /> : (
                    <>
                        <DataTable
                            columns={columns}
                            data={data} />


                        {
                            totalPage !== 1 && (
                                <div className="my-5">
                                    <Pagination >
                                        <PaginationContent>

                                            <PaginationItem>
                                                <PaginationPrevious href="#" onClick={() => {
                                                    setPage(1)

                                                }} />
                                            </PaginationItem>
                                            {
                                                new Array(totalPage).fill(null).map((item, index: number) => {
                                                    return <PaginationItem key={index}>
                                                        <PaginationLink href="#" onClick={() => {
                                                            setPage(index + 1)
                                                        }

                                                        }  >{index + 1}</PaginationLink>
                                                    </PaginationItem>
                                                })
                                            }




                                            <PaginationItem>
                                                <PaginationNext href="#" onClick={() => {
                                                    setPage(totalPage)
                                                }

                                                } />
                                            </PaginationItem>


                                        </PaginationContent>
                                    </Pagination>
                                </div>

                            )
                        }


                    </>
                )
            }


        </div>
    )
}