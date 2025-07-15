import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import InvoiceModel from "@/models/invoice.model"
import { auth } from "@/lib/auth"


import { connectDB } from "@/lib/connectDB"


export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({
                message: "unauthorised acess"
            }, {
                status: 401
            })

        }
        const { invoice_no,
            invoice_date,
            due_date, currency,
            from, to, items,
            sub_total, discount,
            tax_percentage, total, notes } = await request.json()
        const payload = {
            invoice_no,
            invoice_date,
            due_date, currency: currency ?? "USD",
            from, to, items,
            sub_total, discount,
            tax_percentage, total,
            notes,
            status: "PAID",
            userId: session.user.id,
        }



        await connectDB();
        const data = await InvoiceModel.create(payload)

        return NextResponse.json({ message: "invoice created succesfully", data: data })


    }
    catch (error: unknown) {
        let message = "Something went wrong";

        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === "string") {
            message = error;
        }

        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }

}


export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({
                message: "unauthorised acess"
            }, {
                status: 401
            })

        }


        await connectDB();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const invoiceId = searchParams.get("invoiceId")
        const limit = 10;
        const skip = (page - 1) * limit;


        const query = {
            ...(invoiceId && { _id: invoiceId }),
            userId: session.user.id
        }




        const [allInvoice, totalCount] = await Promise.all([
            InvoiceModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            InvoiceModel.countDocuments(query)
        ])


        // const allInvoice = await InvoiceModel.find({ userId: session.user.id }).skip(skip).limit(limit)

        const totalPage = Math.ceil(totalCount / limit)







        return NextResponse.json({ message: "sucess", data: allInvoice, totalCount, totalPage, page })
    } catch (error: unknown) {
        let message = "Something went wrong";

        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({
            message,
        });
    }


}
//update  invoic
export async function PUT(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({
                message: "Unauthorized Acess"
            }, {
                status: 401
            })
        }
        const {
            invoice_no,
            invoice_date,
            due_date, currency,
            from, to, items,
            sub_total, discount,
            tax_percentage, total, notes, status, invoiceId
        } = await request.json()


        const payload = {
            invoice_no,
            invoice_date,
            due_date, currency,
            from, to, items,
            sub_total, discount,
            tax_percentage, total, notes, status
        }


        await connectDB()
        await InvoiceModel.findByIdAndUpdate(invoiceId, payload)


        return NextResponse.json({
            message: "Invoice Updated Succesfully"

        })


    }catch (error: unknown) {
    const message =
        error instanceof Error ? error.message :
        typeof error === "string" ? error :
        "Something went wrong";

    return NextResponse.json(
        { message },
        { status: 500 }
    );
}



}