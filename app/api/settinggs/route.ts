import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import SettingModel from '@/models/settings.model';
import UserModel from '@/models/user.model';
import { connectDB } from '@/lib/connectDB';
import type { IUser } from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    console.log("Received payload:", body);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access...!!' }, { status: 401 });
    }

    await connectDB();

    const {
      logo,
      signature,
      phone,
      firstName,
      lastName,
      currency,
      streetAddress,
      city,
      postalCode,
      accountName,
      accountNumber,
      ifscCode,
      panNumber,
      upiId
    } = body;

    const userId = session.user.id;

    // ✅ Update UserModel
    const userUpdatePayload: Partial<IUser> = {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(currency !== undefined && { currency }),
      ...(streetAddress !== undefined && { streetAddress }),
      ...(city !== undefined && { city }),
      ...(postalCode !== undefined && { postalCode }),
      ...(phone !== undefined && { phone })
    };

    await UserModel.findByIdAndUpdate(userId, userUpdatePayload, { new: true });

    // ✅ Get existing settings
    const existingSettings = await SettingModel.findOne({ userId });

    // ✅ Prepare updated settings payload
    const updatedSettings = {
      ...(existingSettings?.toObject() || {}),
      userId,
      ...(logo !== undefined && { invoiceLogo: logo }),
      ...(accountName !== undefined && { accountName }),
      ...(accountNumber !== undefined && { accountNumber }),
      ...(ifscCode !== undefined && { ifscCode }),
      ...(panNumber !== undefined && { panNumber }),
      ...(upiId !== undefined && { upiId }),
      ...(signature !== undefined && {
        signature: {
          ...((existingSettings?.signature || {}) as object),
          ...signature
        }
      })
    };

    let updatedDoc;

    if (existingSettings) {
      updatedDoc = await SettingModel.findByIdAndUpdate(
        existingSettings._id,
        updatedSettings,
        { new: true }
      );
    } else {
      updatedDoc = await SettingModel.create(updatedSettings);
    }

    console.log("✅ Updated/Created settings:", updatedDoc);

    return NextResponse.json({ message: 'Settings updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong' },
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
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}
