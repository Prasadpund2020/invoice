//app/api/invoice/[userId]/[invoiceId]/route.ts
import { NextResponse } from 'next/server';


import { NextRequest } from 'next/server';
import { connectDB } from "@/lib/connectDB"
import { jsPDF } from "jspdf";
import SettingModel, { ISettings } from '@/models/settings.model';
import InvoiceModel, { IInvoice } from '@/models/invoice.model';
import { format } from 'date-fns';
import CurrencyFormat from '@/lib/CurrencyFormat';
import { ObjectId } from 'mongodb';
import { toWords } from 'number-to-words';
import UserModel from "@/models/user.model"; // update the path if needed



async function getBase64ImageFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const contentType = response.headers.get("content-type") || "image/png";
  return `data:${contentType};base64,${base64}`;
}



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string, userId: string }> }
) {
  try {
    const { userId, invoiceId } = await params;

    await connectDB();




    const settings: ISettings | null = await SettingModel.findOne({ userId: userId });
    console.log("Invoice Logo URL:", settings?.invoiceLogo);
console.log("Signature Image URL:", settings?.signature?.image);
    let logoBase64: string | null = null;
    let signatureBase64: string | null = null;

    if (settings?.invoiceLogo) {
      logoBase64 = await getBase64ImageFromUrl(settings.invoiceLogo);
    }

    if (settings?.signature?.image) {
      signatureBase64 = await getBase64ImageFromUrl(settings.signature.image);
    }
console.log("Logo base64:", logoBase64?.slice(0, 100));
console.log("Signature base64:", signatureBase64?.slice(0, 100));



    const invoice: IInvoice | null = await InvoiceModel.findById(invoiceId);
    const { searchParams } = new URL(request.url);
    const includeBankDetails = searchParams.get("includeBankDetails") === "true";
    console.log("includeBankDetails toggle:", includeBankDetails);


    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userCurrency = user.currency || 'USD';
    console.log("💰 User's currency:", userCurrency);

    console.log("invoice data in pdf:", invoice);



    if (!invoice) {
      return NextResponse.json({ messsage: " No invoice found.." }, { status: 500 });
    }

    if (!settings) {
      return NextResponse.json({ messsage: " Please add Logo and signature in setting section." }, { status: 500 });
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const FULL_WIDTH = 211;
    const COLOR_CODE = settings.primaryColor || "#303030";
    const PAGE_HEIGHT = 297;
    const BOTTOM_MARGIN = 20;
    const MAX_Y = PAGE_HEIGHT - BOTTOM_MARGIN;
    let Yaxis = 0; // <-- track Y position across pages

    const restoreStyles = () => {
      doc.setFontSize(10.5);
      doc.setFont('times', 'normal');
      doc.setTextColor("#000");
      doc.setDrawColor(200);
      doc.setLineWidth(0.1);
    };


    // ✅ Helper to check and trigger new page if needed
    const checkPageBreak = () => {
      if (Yaxis >= MAX_Y) {
        doc.addPage();
        Yaxis = 20;
        restoreStyles();
        renderTableHeader(Yaxis);
      }
    };

    // ✅ Table header renderer for repeated headers
    const renderTableHeader = (startY: number) => {
      doc.setFontSize(10.5);
      doc.setFillColor(COLOR_CODE);
      doc.rect(15, startY, FULL_WIDTH - 30, 6, "F");
      doc.setTextColor("#fff");
      doc.text("No.", 18, startY + 4);
      doc.text("Items", 28, startY + 4);
      doc.text("Quantity", 110, startY + 4);
      doc.text("Price", 140, startY + 4);
      doc.text("Total", 165, startY + 4);
      doc.setTextColor("#000");
      Yaxis = startY + 6;
    };

    // Header bar
    doc.setFillColor(COLOR_CODE);
    doc.rect(0, 0, FULL_WIDTH, 2, "F");

    // Logo and title
    const logoX = 13;
    const logoY = 5;
    const logoWidth = 60;
    const logoHeight = 30;
    if (logoBase64) {
      doc.addImage(logoBase64, logoX, logoY, logoWidth, logoHeight);
    }


    doc.setFontSize(25);
    const invoiceTextY = logoY + logoHeight / 2 + 2;
    doc.text("INVOICE", FULL_WIDTH - 15, invoiceTextY, { align: "right" });

    // From section
    const fromY = logoY + logoHeight + 5;
    doc.setFontSize(13).setFont('times', 'bold');
    doc.text(invoice.from.name, 15, fromY);

    doc.setFontSize(9).setFont('times', 'normal');
    let senderY = fromY + 5;
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

    // Invoice metadata
    doc.text(`Invoice No: ${invoice.invoice_no}`, FULL_WIDTH - 15, 35, { align: "right" });
    doc.text(`Invoice Date: ${format(invoice.invoice_date, "PPP")}`, FULL_WIDTH - 15, 40, { align: "right" });
    doc.text(`Due Date: ${format(invoice.due_date, "PPP")}`, FULL_WIDTH - 15, 45, { align: "right" });

    // Bill To
    senderY += 5;
    doc.text("Bill To", 15, senderY);
    doc.setFontSize(13).setFont('times', 'bold');
    doc.text(invoice.to.name, 15, senderY + 10);

    doc.setFontSize(9).setFont('times', 'normal');
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

    // ✅ Render table header before items
    renderTableHeader(receiverY + 10);
    console.log("invoice.items", invoice.items);

    // ✅ Render each item with pagination check
    invoice.items.forEach((item, index) => {

      Yaxis += 8;
      checkPageBreak();

      doc.setFontSize(10).setTextColor("#000");
      doc.text(`${index + 1}`, 18, Yaxis);
      doc.text(`${item.item_name}`, 28, Yaxis);
      doc.text(`${item.quantity}`, 110, Yaxis);
      doc.text(`${item.price}`, 140, Yaxis);
      doc.text(`${item.total}`, 165, Yaxis);





      if (item.item_description?.trim()) {
        Yaxis += 4;
        checkPageBreak();
        doc.setFontSize(8).setTextColor("#555");
        doc.text(`- ${item.item_description.trim()}`, 28, Yaxis);
        Yaxis += 2;
        checkPageBreak();
      }

      doc.setDrawColor(200);
      doc.line(15, Yaxis + 2, FULL_WIDTH - 15, Yaxis + 2);
      Yaxis += 4;
    });

    // ✅ Ensure space for totals and signature
    if (Yaxis + 60 >= MAX_Y) {
      doc.addPage();
      Yaxis = 20;
    }

    const totalsStartY = Yaxis + 10;
    doc.setFontSize(10).setFont('times', 'bold').setTextColor('#000');
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
    doc.text(`${CurrencyFormat(totalAmount, userCurrency, true)}`, FULL_WIDTH - 15, totalsStartY + 20, { align: "right" });


    let signatureY = totalsStartY + 30; // Default Y if no words section

    // ✅ Show total in words only for INR
    // === Total In Words (INR only) ===
    if (userCurrency === "INR") {
      const amountInWords = toWords(totalAmount);
      const currencyInWords = `Indian Rupee ${amountInWords.replace(/\b\w/g, c => c.toUpperCase())} Only`;

      doc.setFontSize(9).setFont('times', 'bold').setTextColor("#000");
      const totalInWordsLines = doc.splitTextToSize(`Total In Words: ${currencyInWords}`, 80);
      const totalInWordsY = totalsStartY + 27;

      totalInWordsLines.forEach((line: string, i: number) => {
        doc.text(line, FULL_WIDTH - 15, totalInWordsY + i * 5, { align: "right" });
      });

      const totalInWordsHeight = totalInWordsLines.length * 5;
      signatureY = totalInWordsY + totalInWordsHeight + 10; // Update Y only if INR
    }

    // ✅ If signature would overflow, add page
    if (signatureY + 40 >= MAX_Y) {
      doc.addPage();
      signatureY = 20;
    }

    // ✅ Signature block
    doc.setFont('times', "normal");

    const signatureImageHeight = 20;
    const signatureImageY = signatureY;

    // === Signature Image on RIGHT ===
    if (signatureBase64) {
  doc.setFontSize(10).setFont('times', 'bold').setTextColor('#000');
  doc.addImage(signatureBase64, FULL_WIDTH - 60, signatureImageY, 50, signatureImageHeight);
}

    const leftSignatureY = signatureImageY + signatureImageHeight + 6;

    // Draw a signature line above the label
    const lineStartX = 15;
    const lineEndX = 70;
    const lineY = leftSignatureY - 6;

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(lineStartX, lineY, lineEndX, lineY);

    doc.setFontSize(9).setTextColor("#000").setFont("times", "italic");
    doc.text("Authorized Signature", lineStartX, leftSignatureY);
    doc.setFont('times', 'bold');
    doc.text(`${settings.signature?.name || ""}`, lineStartX, leftSignatureY + 5);

    // ✅ Declare notesY early to avoid usage-before-declaration error
    // === Bank Details (above Notes) ===

    // ✅ Step 1: Start notesY after the signature block
    let notesY = leftSignatureY + 20;

    // ✅ Step 2: Check if any bank field is present
    const hasBankDetails =
      settings.accountName ||
      settings.accountNumber ||
      settings.ifscCode ||
      settings.panNumber ||
      settings.upiId;

    console.log("hasBankDetails:", hasBankDetails);

    if (hasBankDetails) {
      console.log('invoice.showBankDetails:', invoice.showBankDetails);
      let bankY = notesY;

      // ✅ Step 3: If it overflows the page, move to new page
      if (bankY + 30 >= MAX_Y) {
        doc.addPage();
        bankY = 20;
        notesY = bankY + 55; // push notesY down too
      }

      let bankLineY = bankY;


      if (invoice.showBankDetails && hasBankDetails) {
        console.log("Rendering bank details...");

        doc.setFont('times', 'bold');
        doc.text("Bank Details", 15, bankLineY);
        bankLineY += 6;

        doc.setFont('times', 'normal');

        // ✅ Step 4: Render each available field
        if (settings.accountName) doc.text(`Account Name : ${settings.accountName}`, 15, bankLineY += 5);
        if (settings.accountNumber) doc.text(`Account No   : ${settings.accountNumber}`, 15, bankLineY += 5);
        if (settings.ifscCode) doc.text(`IFSC Code    : ${settings.ifscCode}`, 15, bankLineY += 5);
        if (settings.panNumber) doc.text(`PAN          : ${settings.panNumber}`, 15, bankLineY += 5);
        if (settings.upiId) doc.text(`UPI ID       : ${settings.upiId}`, 15, bankLineY += 5);
      }


      // ✅ Step 5: Update notesY to start after bank details
      notesY = bankLineY + 10;
    }


    // === Notes section ===
    if (notesY + 20 >= MAX_Y) {
      doc.addPage();
      notesY = 20;
    }

    doc.setFont('times', "bold");
    doc.text("Notes : ", 15, notesY);

    doc.setFont('times', "normal");
    doc.text(`${invoice.notes}`, 15, notesY + 5);

    // === Footer (only on last page) ===
    const footerLineY = 285;
    doc.setDrawColor(150).setLineWidth(0.4);
    doc.line(15, footerLineY, FULL_WIDTH - 15, footerLineY);

    doc.setFontSize(9.5).setTextColor("#333").setFont("times", "normal");
    doc.text("Crafted with precision by AI Alphatech · www.aialphatech.com", FULL_WIDTH / 2, footerLineY + 7, {
      align: "center"
    });

    // === Export PDF Buffer ===
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
    return NextResponse.json({ message: errorMessage });
  }
}



export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; invoiceId: string }> }
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


