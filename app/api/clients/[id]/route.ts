import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import { ObjectId } from 'mongodb';

export async function DELETE(
  req: NextRequest,
  {params}: { params:Promise< { id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid client ID' }, { status: 400 });
  }

  try {
    const db = await connectDB();
    const clientsCollection = db.collection('clients');

    const result = await clientsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ message: 'Failed to delete client' }, { status: 500 });
  }
}
