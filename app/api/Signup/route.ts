import { connectDB } from "@/lib/connectDB";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 }
            );
        }

        await connectDB();

        console.log("DB connected");


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            hashedPassword,
        });

        return NextResponse.json(
            { message: "User created successfully." },
            { status: 201 }
        );

    } catch (error) {
        console.error("[SIGNUP_ERROR]", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
