// /app/api/admin/update-password/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/connectDB";
import AdminModel from "@/models/admin.model";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, oldPassword, newPassword } = await req.json();

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Old password incorrect" }, { status: 401 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;
        await admin.save();

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
