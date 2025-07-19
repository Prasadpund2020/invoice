import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    // Admin credentials stored securely in environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return NextResponse.json({ success: true }, { status: 200 });
    } else {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
}
