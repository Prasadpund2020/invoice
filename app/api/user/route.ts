import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import UserModel from '@/models/user.model';
import { connectDB } from '@/lib/connectDB';

export async function PUT(request: NextRequest) {
  try {
    // ✅ Extract all onboarding fields, including logo, phone, and signature
    const { firstName, lastName, currency, logo, phone, signature } = await request.json();

    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // ✅ Save all the new fields in DB
    await UserModel.findByIdAndUpdate(session.user?.id, {
      firstName,
      lastName,
      currency,
      logo,             // ✅ new
      phone,            // ✅ new
      signature         // ✅ new: should be an object like { name, image }
    });

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error: unknown) {
    return NextResponse.json({
      message: error instanceof Error ? error.message : 'An error occurred',
    }, {
      status: 500
    });
  }
}
