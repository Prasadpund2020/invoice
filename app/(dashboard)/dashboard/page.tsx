"use client";
import {
  Card,
  CardContent,
 
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartInvoice } from "@/app/(dashboard)/_component/ChartInvoice"
import { ChartConfig } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { IInvoice } from "@/models/invoice.model";
import { DataTable }  from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  totalRevenue: {
    label: "Total Revenue",
    color: "var(--chart-1)",
  },
  paidRevenue: {
    label: "Paid Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [data, setData] = useState({
    totalRevenue: "$0",
    totalInvoice: 0,
    paidInvoice: 0,
    UnpaidInvoice: 0,
    recentInvoice: [],
    chartData: [],
  });

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const responseData = await response.json();

      //console.log("responseData",responseData)
      if (response.status === 200) {
        setData({
          totalRevenue: responseData.totalRevenue,
          totalInvoice: responseData.totalInvoice,
          paidInvoice: responseData.paidInvoice,
          UnpaidInvoice: responseData.UnpaidInvoice,
          recentInvoice: responseData.recentInvoice || [],
          chartData: responseData.chartData || [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

   const columns: ColumnDef<IInvoice>[] = [
    {
      accessorKey: "invoice_no",
      header: "Invoice No",
    },
    {
      accessorKey: "invoice_date",
      header: "Date",
      cell: ({ row }) => {
        return format(row.original.invoice_date, "PP");
      },
    }, 
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const totalAmountInCurrencyFormat = new Intl.NumberFormat("en-us", {
          style: "currency",
          currency: row.original.currency,
        }).format(row.original.total);

        return totalAmountInCurrencyFormat;
      },
    },
    {
       accessorKey : "status",
       header : "Status",
       cell : ({row})=>{
        return <Badge>{row.original.status}</Badge>
       }
    },
  ];
  return (
    <div className="p-4 grid gap-6  lg:grid-cols-4">
      <Card className="grid gap-3">
        <CardHeader>
          <CardTitle className="text-xl">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-lg">{data?.totalRevenue ?? "-"}</p>
            <span className="text-muted-foreground text-xs">last 30 days</span>
          </div>
        </CardContent>
      </Card>

      <Card className="grid gap-3">
        <CardHeader>
          <CardTitle className="text-xl">Total Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-lg">{data?.totalInvoice ?? "-"}</p>
            <span className="text-muted-foreground text-xs">last 30 days</span>
          </div>
        </CardContent>
      </Card>

      <Card className="grid gap-3">
        <CardHeader>
          <CardTitle className="text-xl">Paid Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-lg">{data?.paidInvoice ?? "-"}</p>
            <span className="text-muted-foreground text-xs">last 30 days</span>
          </div>
        </CardContent>
      </Card>

      <Card className="grid gap-3">
        <CardHeader>
          <CardTitle className="text-xl">Unpaid Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-lg">{data?.UnpaidInvoice ?? "-"}</p>
            <span className="text-muted-foreground text-xs">last 30 days</span>
          </div>
        </CardContent>
      </Card>

      {/***chart */}
      <ChartInvoice chartConfig={chartConfig} chartData={data.chartData} />

      {/***latest 10 Invoice last 30days */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Invoice</CardTitle>
        </CardHeader>
        <CardContent>
            {
                data?.recentInvoice?.length == 0 ? (
                    <p className="py-4 text-center">No invoice found</p>
                ) : (
                    <DataTable
                        data={data?.recentInvoice}
                        columns={columns}
                    />
                )
            }

        </CardContent>
      </Card>
    </div>
  );
}