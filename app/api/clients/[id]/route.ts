// app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB'; // adjust this to your actual path
import { ObjectId } from 'mongodb';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid client ID" }, { status: 400 });
  }

  try {
    const db = await connectDB();
    const clientsCollection = db.collection('clients');

    const result = await clientsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ message: "Failed to delete client" }, { status: 500 });
  }
}
