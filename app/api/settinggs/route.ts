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

   const {
  logo,
  signature,
  phone,
  firstName,
  lastName,
  currency,
  streetAddress,
  city,
  postalCode
} = await request.json();


    await connectDB();

    const payload = {
      userId: session.user.id,
      ...(logo && { invoiceLogo: logo }),
      ...(signature && { signature }),
      ...(phone && { phone })
    };

    // Update UserModel
   await UserModel.findByIdAndUpdate(session.user.id, {
  ...(firstName && { firstName }),
  ...(lastName && { lastName }),
  ...(currency && { currency }),
  ...(streetAddress && { streetAddress }),
  ...(city && { city }),
  ...(postalCode && { postalCode })
});

    // Update or create settings
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

    // Fetch user with renamed address fields
    const [user, settings] = await Promise.all([
      UserModel.findById(session.user.id)
        .select('firstName lastName currency phone streetAddress city postalCode')
        .lean(),
      SettingModel.findOne({ userId: session.user.id }).lean(),
    ]);

    return NextResponse.json(
      { user, settings },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}
