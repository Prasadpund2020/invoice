import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { connectDB } from "@/lib/connectDB"
import { jsPDF } from "jspdf";
import { headers } from 'next/headers';
import SettingModel from '@/models/settings.model';
import InvoiceModel, { IInvoice } from '@/models/invoice.model';
import { format } from 'date-fns';



export async function GET(request: NextRequest, { params }: { params: Promise<{ invoiceId: string, userId: string }> }) {
    try {
        const { userId, invoiceId } = await params
        console.log(invoiceId, userId)

        await connectDB()
        const settings = await SettingModel.findOne({ userId: userId })
        const invoice: IInvoice | null = await InvoiceModel.findById(invoiceId)

        if (!invoice) {
            return NextResponse.json({
                messsage: " No invoice found.."
            })

        }





        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const FULL_WIDTH = 211
        const COLOR_CODE = "#8c00ff"




        doc.setFillColor(COLOR_CODE)
        doc.rect(0, 0, FULL_WIDTH, 2, "F")



        doc.addImage(settings.invoiceLogo, 15, 13, 50, 15)

        doc.setFontSize(25)
        doc.text("INVOICE", FULL_WIDTH - 15, 22, { align: "right" })


        doc.setFontSize(13)
        doc.setFont('times', 'bold')
        doc.text(invoice.from.name, 15, 35)

        doc.setFontSize(9)
        doc.setFont('times', 'normal')
        doc.text(invoice.from.address1, 15, 40)
        doc.text(invoice.from.address2 as string, 15, 45)
        doc.text(invoice.from.address3 as string, 15, 50)

        doc.text(`Invoice No: ${invoice.invoice_no}`, FULL_WIDTH - 15, 35, { align: "right" })
        doc.text(`Invoice Date: ${format(invoice.invoice_date, "PPP")}`, FULL_WIDTH - 15, 40, { align: "right" })
        doc.text(`Due Date: ${format(invoice.due_date, "PPP")}`, FULL_WIDTH - 15, 45, { align: "right" })

        doc.text("Bill To", 15, 60)

        doc.setFontSize(13)
        doc.setFont('times', 'bold')
        doc.text(invoice.to.name, 15, 70)

        doc.setFontSize(9)
        doc.setFont('times', 'normal')
        doc.text(invoice.to.address1, 15, 75)
        doc.text(invoice.to.address2 as string, 15, 80)
        doc.text(invoice.to.address3 as string, 15, 85)


        doc.setFontSize(10.5)
        doc.setFillColor(COLOR_CODE)
        doc.rect(15,95,FULL_WIDTH-30,6,"F")
        doc.setTextColor("#fff")
        doc.text("Items", 18, 99)
        doc.text("Quantity", 110, 99)
        doc.text("Price", 140, 99)
        doc.text("Total", 170, 99)


















        const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

        return new NextResponse(pdfBuffer, {
            headers: {
                "content-type": "application/pdf",
                "content-disposition": "inline"
            }
        })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            message: error || error.message || "something went wrong"
        })

    }

}
