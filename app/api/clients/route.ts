import { NextResponse } from "next/server";
import { ClientSchema as ZodClientSchema } from "@/lib/zodSchema";
import { connectDB } from "@/lib/connectDB";
import Client from "@/models/clients";
import { auth } from "@/lib/auth"; // ✅ import auth to get user session

// GET: Return clients for logged-in user only
export async function GET() {
  try {
    const session = await auth(); // 👈 get user session
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 👇 Only get clients where user === logged-in user
    const clients = await Client.find({ user: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { message: "Error fetching clients" },
      { status: 500 }
    );
  }
}

// POST: Add client for the logged-in user
export async function POST(req: Request) {
  try {
    const session = await auth(); // 👈 get user session
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validated = ZodClientSchema.parse(body);

    await connectDB();

    // 👇 Attach user ID when creating client
    const newClient = await Client.create({
      ...validated,
      user: session.user.id,
    });

    return NextResponse.json(
      { message: "Client added", clientId: newClient._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      {
        message: "Error adding client",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
