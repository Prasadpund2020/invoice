import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import SettingModel from '@/models/settings.model';
import UserModel from '@/models/user.model';
import { connectDB } from '@/lib/connectDB';
import type { IUser } from '@/models/user.model';

interface ISignature {
  name?: string;
  image?: string;
}

interface ISettings {
  userId: string;
  invoiceLogo?: string;
  accountName?: string;
  accountNumber?: string;
  ifscCode?: string;
  panNumber?: string;
  upiId?: string;
  primaryColor?: string;
  signature?: ISignature;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }
   
    await connectDB();
     console.log("Settings API called by prasad user:", session.user.id);
    const body = await request.json();
    console.log("Settings API received:", body);

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
      upiId,
      primaryColor
    } = body;

    const userId = session.user.id;

    console.log("####",signature.image)

    // Update user personal info
    const userUpdatePayload: Partial<IUser> = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(currency && { currency }),
      ...(streetAddress && { streetAddress }),
      ...(city && { city }),
      ...(postalCode && { postalCode }),
      ...(phone && { phone }),
    };
    await UserModel.findByIdAndUpdate(userId, userUpdatePayload, { new: true });

    // Find existing settings
    const existingSettings = await SettingModel.findOne({ userId });

    // Prepare updated settings
    const updatedSettings: Partial<ISettings> = {
      userId,
      ...(logo && { invoiceLogo: logo }),
      ...(accountName && { accountName }),
      ...(accountNumber && { accountNumber }),
      ...(ifscCode && { ifscCode }),
      ...(panNumber && { panNumber }),
      ...(upiId && { upiId }),
      ...(primaryColor && { primaryColor }),
    };
    console.log("Updated settings payload:", updatedSettings);

    const asAny = updatedSettings as any;

if (signature) {
  if (signature.name !== undefined) {
    asAny['signature.name'] = signature.name;
  }
  if (signature.image !== undefined) {
    asAny['signature.image'] = signature.image;
  }
}
    console.log("Final settings to be saved:", updatedSettings.signature?.image);
   const updatedDoc = existingSettings
  ? await SettingModel.findByIdAndUpdate(existingSettings._id, asAny, { new: true })
  : await SettingModel.create(asAny);

    console.log("UPADTED DATA",updatedDoc)

    return NextResponse.json({ message: 'Settings updated successfully', settings: updatedDoc }, { status: 200 });
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

    return NextResponse.json({ user, settings }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}
