import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { connectDB } from "@/lib/connectDB"
import { jsPDF } from "jspdf";
import { headers } from 'next/headers';
import SettingModel, { ISettings } from '@/models/settings.model';
import InvoiceModel, { IInvoice } from '@/models/invoice.model';
import { format } from 'date-fns';
import CurrencyFormat from '@/lib/CurrencyFormat';



export async function GET(request: NextRequest, { params }: { params: Promise<{ invoiceId: string, userId: string }> }) {
    try {
        const { userId, invoiceId } = await params
        console.log(invoiceId, userId)

        await connectDB()
        const settings: ISettings | null = await SettingModel.findOne({ userId: userId })
        const invoice: IInvoice | null = await InvoiceModel.findById(invoiceId)

        if (!invoice) {
            return NextResponse.json({
                messsage: " No invoice found.."
            }, {
                status: 500
            })

        }
        if (!settings) {
            return NextResponse.json({
                messsage: " Please add Logo and signature in setting section."
            }, {
                status: 500
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



        doc.addImage(settings.invoiceLogo as string, 15, 13, 50, 15)

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

        const ITEMS_XAXIS = 18
        const QUANTITY_XAXIS = 110
        const PRICE_XAXIS = 140
        const TOTAL_XAXIS = 165


        doc.setFontSize(10.5)
        doc.setFillColor(COLOR_CODE)
        doc.rect(15, 95, FULL_WIDTH - 30, 6, "F")
        doc.setTextColor("#fff")
        doc.text("Items", ITEMS_XAXIS, 99)
        doc.text("Quantity", QUANTITY_XAXIS, 99)
        doc.text("Price", PRICE_XAXIS, 99)
        doc.text("Total", TOTAL_XAXIS, 99)



        let Yaxis = 99
        doc.setTextColor("000")
        doc.setFontSize(10)



        invoice.items.forEach((item, index) => {
            Yaxis = Yaxis + 6

            doc.text(`${item.item_name}`, ITEMS_XAXIS, Yaxis)
            doc.text(`${item.quantity}`, QUANTITY_XAXIS, Yaxis)
            doc.text(`${CurrencyFormat(item.price, invoice.currency)}`, PRICE_XAXIS, Yaxis)
            doc.text(`${CurrencyFormat(item.total, invoice.currency)}`, TOTAL_XAXIS, Yaxis)


        })

        doc.text(`Sub Total :`, 160, Yaxis + 15)
        doc.text(`${invoice.sub_total}`, FULL_WIDTH - 15, Yaxis + 15, { align: "right" })

        doc.text(`Discount :`, 160, Yaxis + 20)
        doc.text(`-${invoice.discount}`, FULL_WIDTH - 15, Yaxis + 20, { align: "right" })



        const subtotal_remove_discount = Number(invoice.sub_total) - Number(invoice.discount)
        doc.text(`${subtotal_remove_discount}`, FULL_WIDTH - 15, Yaxis + 25, { align: "right" })

        doc.text(`Tax ${invoice.tax_percentage} %`, 160, Yaxis + 30)
        const taxAmount = (subtotal_remove_discount * Number(invoice.tax_percentage)) / 100
        doc.text(`${taxAmount}`, FULL_WIDTH - 15, Yaxis + 30, { align: "right" })

        doc.setFont('times', "bold")
        const totalAmount = Number(invoice.total) - Number(taxAmount)
        doc.text(`Total`, 160, Yaxis + 35)
        doc.text(`${totalAmount}`, FULL_WIDTH - 15, Yaxis + 35, { align: "right" })



        doc.setFont('times', "bold")
        // Larger size, e.g., double the original
        doc.addImage(settings.signature?.image as string, FULL_WIDTH - 65, Yaxis + 40, 60, 25);
        doc.text(`${settings.signature?.name as string}`, FULL_WIDTH - 15, Yaxis + 60, { align: "right" })

 

        doc.setFont('times', "bold")
        doc.text("Notes:", 15, Yaxis + 70)
        doc.setFont('times', "normal")
        doc.text(`${invoice.notes}`,15,Yaxis+75)

























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
