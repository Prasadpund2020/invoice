import { NextResponse } from "next/server";
import { ClientSchema as ZodClientSchema } from "@/lib/zodSchema";
import { connectDB } from "@/lib/connectDB";
import Client from "@/models/clients";

export async function GET() {
  try {
    await connectDB();
    // Fetch all clients sorted by creation date descending
    const clients = await Client.find().sort({ createdAt: -1 });

    // Return clients array directly (important for frontend to handle correctly)
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { message: "Error fetching clients" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input with Zod schema
    const validated = ZodClientSchema.parse(body);

    // Connect to DB
    await connectDB();

    // Create new client document in MongoDB
    const newClient = await Client.create(validated);

    // Return success message with new client's ID
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
