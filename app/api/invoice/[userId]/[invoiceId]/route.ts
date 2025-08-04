import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { connectDB } from "@/lib/connectDB"
import { jsPDF } from "jspdf";
import SettingModel, { ISettings } from '@/models/settings.model';
import InvoiceModel, { IInvoice } from '@/models/invoice.model';
import { format } from 'date-fns';
import CurrencyFormat from '@/lib/CurrencyFormat';
import { ObjectId } from 'mongodb';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string, userId: string }> }
) {
  try {
    const { userId, invoiceId } = await params;

    await connectDB();
    const settings: ISettings | null = await SettingModel.findOne({ userId: userId });
    const invoice: IInvoice | null = await InvoiceModel.findById(invoiceId);

    if (!invoice) {
      return NextResponse.json({
        messsage: " No invoice found.."
      }, { status: 500 });
    }

    if (!settings) {
      return NextResponse.json({
        messsage: " Please add Logo and signature in setting section."
      }, { status: 500 });
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const FULL_WIDTH = 211;
    const COLOR_CODE = "#8c00ff";

    doc.setFillColor(COLOR_CODE);
    doc.rect(0, 0, FULL_WIDTH, 2, "F");

    if (settings.invoiceLogo) {
      doc.addImage(settings.invoiceLogo as string, 15, 13, 50, 15);
    }

    doc.setFontSize(25);
    doc.text("INVOICE", FULL_WIDTH - 15, 22, { align: "right" });

    doc.setFontSize(13);
    doc.setFont('times', 'bold');
    doc.text(invoice.from.name, 15, 35);

    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    let senderY = 40;

    doc.text(invoice.from.address1, 15, senderY);
    senderY += 5;
    if (invoice.from.address2) {
      doc.text(invoice.from.address2, 15, senderY);
      senderY += 5;
    }
    if (invoice.from.address3) {
      doc.text(invoice.from.address3, 15, senderY);
      senderY += 5;
    }
    
    // Invoice info on right side
    doc.text(`Invoice No: ${invoice.invoice_no}`, FULL_WIDTH - 15, 35, { align: "right" });
    doc.text(`Invoice Date: ${format(invoice.invoice_date, "PPP")}`, FULL_WIDTH - 15, 40, { align: "right" });
    doc.text(`Due Date: ${format(invoice.due_date, "PPP")}`, FULL_WIDTH - 15, 45, { align: "right" });

    // Bill To Section
    senderY += 5;
    doc.text("Bill To", 15, senderY);

    doc.setFontSize(13);
    doc.setFont('times', 'bold');
    doc.text(invoice.to.name, 15, senderY + 10);

    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    let receiverY = senderY + 15;
    doc.text(invoice.to.address1, 15, receiverY);
    receiverY += 5;
    if (invoice.to.address2) {
      doc.text(invoice.to.address2, 15, receiverY);
      receiverY += 5;
    }
    if (invoice.to.address3) {
      doc.text(invoice.to.address3, 15, receiverY);
      receiverY += 5;
    }

    // Table Headers
    const ITEMS_XAXIS = 18;
    const QUANTITY_XAXIS = 110;
    const PRICE_XAXIS = 140;
    const TOTAL_XAXIS = 165;

    const tableStartY = receiverY + 10;

    doc.setFontSize(10.5);
    doc.setFillColor(COLOR_CODE);
    doc.rect(15, tableStartY, FULL_WIDTH - 30, 6, "F");
    doc.setTextColor("#fff");
    doc.text("Items", ITEMS_XAXIS, tableStartY + 4);
    doc.text("Quantity", QUANTITY_XAXIS, tableStartY + 4);
    doc.text("Price", PRICE_XAXIS, tableStartY + 4);
    doc.text("Total", TOTAL_XAXIS, tableStartY + 4);

    let Yaxis = tableStartY + 4;
    doc.setTextColor("000");
    doc.setFontSize(10);

    invoice.items.forEach((item) => {
      Yaxis += 6;
      doc.setFontSize(10);
      doc.setTextColor("#000");
      doc.text(`${item.item_name}`, ITEMS_XAXIS, Yaxis);
      doc.text(`${item.quantity}`, QUANTITY_XAXIS, Yaxis);
      doc.text(`${CurrencyFormat(item.price, invoice.currency)}`, PRICE_XAXIS, Yaxis);
      doc.text(`${CurrencyFormat(item.total, invoice.currency)}`, TOTAL_XAXIS, Yaxis);

      if (item.item_description?.trim()) {
        Yaxis += 4;
        doc.setFontSize(8);
        doc.setTextColor("#555");
        doc.text(`- ${item.item_description.trim()}`, ITEMS_XAXIS, Yaxis);
        Yaxis += 2;
        doc.setTextColor("#000");
      }
    });

    // Totals section
    const totalsStartY = Yaxis + 10;
    doc.setFontSize(10);
    doc.text(`Sub Total :`, 160, totalsStartY);
    doc.text(`${invoice.sub_total}`, FULL_WIDTH - 15, totalsStartY, { align: "right" });

    doc.text(`Discount :`, 160, totalsStartY + 5);
    doc.text(`-${invoice.discount}`, FULL_WIDTH - 15, totalsStartY + 5, { align: "right" });

    const subtotal_remove_discount = invoice.sub_total - (invoice.discount || 0);
    doc.text(`${subtotal_remove_discount}`, FULL_WIDTH - 15, totalsStartY + 10, { align: "right" });

    doc.text(`Tax ${invoice.tax_percentage}% :`, 160, totalsStartY + 15);
    let taxAmount = 0;
    if (invoice.tax_percentage) {
      taxAmount = (subtotal_remove_discount * Number(invoice.tax_percentage)) / 100;
    }
    doc.text(`${taxAmount}`, FULL_WIDTH - 15, totalsStartY + 15, { align: "right" });

    doc.setFont('times', "bold");
    const totalAmount = Number(subtotal_remove_discount) + Number(taxAmount);
    doc.text(`Total :`, 160, totalsStartY + 20);
    doc.text(`${totalAmount}`, FULL_WIDTH - 15, totalsStartY + 20, { align: "right" });

    // Signature
    doc.setFont('times', "normal");
    if (settings.signature?.image) {
      doc.addImage(settings.signature.image as string, FULL_WIDTH - 60, totalsStartY + 25, 50, 20);
    }
    doc.text(`${settings.signature?.name as string}`, FULL_WIDTH - 15, totalsStartY + 47, { align: "right" });

    // Notes
    doc.setFont('times', "bold");
    doc.text("Notes : ", 15, totalsStartY + 55);
    doc.setFont('times', "normal");
    doc.text(`${invoice.notes}`, 15, totalsStartY + 60);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": "inline"
      }
    });
  } catch (error) {
    console.log(error);

    let errorMessage = "Something went wrong";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({
      message: errorMessage
    });
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params:Promise< { userId: string; invoiceId: string } >}
): Promise<NextResponse> {
  const { invoiceId } = await params;

  if (!ObjectId.isValid(invoiceId)) {
    return NextResponse.json({ message: 'Invalid invoice ID' }, { status: 400 });
  }

  try {
    await connectDB();

    const deleted = await InvoiceModel.findByIdAndDelete(invoiceId);

    if (!deleted) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invoice deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ message: 'Failed to delete invoice' }, { status: 500 });
  }
}


