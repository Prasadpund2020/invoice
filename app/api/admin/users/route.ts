import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    const users = await UserModel.find().lean().exec();

    return NextResponse.json(users);
}
