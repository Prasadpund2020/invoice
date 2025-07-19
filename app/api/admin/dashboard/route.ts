import { connectDB } from "@/lib/connectDB";
import InvoiceModel from "@/models/invoice.model";
import UserModel from "@/models/user.model"; // ✅ Import this
import { NextResponse } from "next/server";
import "@/models/user.model"; // Ensure model registration


interface PopulatedInvoice {
    invoice_no: string;
    invoice_date: Date;
    due_date: Date;
    currency: string;
    total: number;
    status: "PAID" | "PENDING" | "CANCEL";
    userId?: { email?: string } | null;
}

export async function GET() {
    await connectDB();

    const invoices = await InvoiceModel.find({})
        .populate({
            path: "userId",
            model: "User",
            select: "email",
        })
        .lean()
        .exec() as unknown as PopulatedInvoice[];

    const formattedInvoices = invoices.map((inv) => ({
        ...inv,
        userEmail: inv.userId?.email || "Unknown",
    }));

    const totalRevenue = invoices.reduce((acc, cur) => acc + (cur.total ?? 0), 0);

    const chartDataMap = new Map<string, { totalRevenue: number; paidRevenue: number }>();

    invoices.forEach((invoice) => {
        const dateKey = invoice.invoice_date.toISOString().split("T")[0];

        const existing = chartDataMap.get(dateKey) || { totalRevenue: 0, paidRevenue: 0 };
        existing.totalRevenue += invoice.total ?? 0;

        if (invoice.status === "PAID") {
            existing.paidRevenue += invoice.total ?? 0;
        }

        chartDataMap.set(dateKey, existing);
    });

    const chartData = Array.from(chartDataMap.entries()).map(([date, { totalRevenue, paidRevenue }]) => ({
        date,
        totalRevenue,
        paidRevenue,
    }));

    const totalUsers = await UserModel.countDocuments(); // ✅ This is what you asked for

    return NextResponse.json({
        totalRevenue: totalRevenue.toFixed(2),
        totalInvoice: invoices.length,
        paidInvoice: invoices.filter((inv) => inv.status === "PAID").length,
        UnpaidInvoice: invoices.filter((inv) => inv.status === "PENDING").length,
        totalUsers, // ✅ Add this to response
        recentInvoice: formattedInvoices.slice(-5).reverse(),
        chartData,
    });
}
