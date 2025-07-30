import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import InvoiceModel from "@/models/invoice.model";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const latestInvoice = await InvoiceModel.findOne({ userId: session.user.id }).sort({ invoice_no: -1 });

    const nextInvoiceNo = latestInvoice ? Number(latestInvoice.invoice_no) + 1 : 1;

    // ✅ Convert to string before sending to match schema
    return NextResponse.json({ nextInvoiceNo: String(nextInvoiceNo) });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
