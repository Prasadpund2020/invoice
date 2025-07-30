import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import SettingModel from '@/models/settings.model';
import UserModel from '@/models/user.model';
import { connectDB } from '@/lib/connectDB';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'unauthorized access...!!' }, { status: 401 });
    }

    const { logo, signature, phone, firstName, lastName, currency } = await request.json();
    await connectDB();

    const payload = {
      userId: session.user.id,
      ...(logo && { invoiceLogo: logo }),
      ...(signature && { signature }),
      ...(phone && { phone }),
    };

    await UserModel.findByIdAndUpdate(session.user.id, {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(currency && { currency }),
    });

    const setting = await SettingModel.findOne({ userId: session.user.id });

    if (setting) {
      await SettingModel.findByIdAndUpdate(setting._id, payload);
    } else {
      await SettingModel.create(payload);
    }

    return NextResponse.json({ message: 'Setting updated successfully' });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    await connectDB();

    const settings = await SettingModel.findOne({ userId: session.user.id });

    return NextResponse.json({ data: settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}
