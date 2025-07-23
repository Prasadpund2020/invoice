// /app/api/admin/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/connectDB";
import AdminModel from "@/models/admin.model";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await AdminModel.create({ email, password: hashedPassword });

        return NextResponse.json({ message: "Admin created" }, { status: 201 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
