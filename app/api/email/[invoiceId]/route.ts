import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email.config";
import InvoiceModel, { IInvoice } from "@/models/invoice.model";
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/connectDB"
import { InvoiceTemplate } from "@/components/template/SendInvoiceEmail"
import { currencyOption, TCurrencyKey } from "@/lib/utils";
import { format } from 'date-fns';
import { ReactNode } from "react";







export async function POST(request: NextRequest, { params }: { params: Promise<{ invoiceId: string, userId: string }> }) {
  try {
    const session = await auth()
    const {subject} =await request.json()
    const { invoiceId } = await params;
        await connectDB();

    const  invoiceData : IInvoice|null = await  InvoiceModel.findById(invoiceId)
    if(!invoiceData){
      return NextResponse.json({
        message:"No Invoice Found"
      })
    }


    const invoiceURL = `${process.env.DOMAIN}/api/invoice/${session?.user.id}/${invoiceId}`



      const emailResponse = await sendEmail(
      invoiceData.to.email,
      subject,
      InvoiceTemplate({
        firstName : session?.user.firstName,
        invoiceNo : invoiceData.invoice_no,
        dueDate : format(invoiceData.due_date,"PPP"),
        total : `${currencyOption[invoiceData.currency as TCurrencyKey ]} ${invoiceData.total}`,
        invoiceURL :invoiceURL ,
      }) as ReactNode
    );
    return NextResponse.json({
      message:"email send succesfully",
      data:emailResponse
    })


  } catch (error: unknown) {
    return NextResponse.json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
}
