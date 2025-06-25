import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import UserModel from '@/models/user.model';
import {connectDB} from '@/lib/connectDB';

export async function PUT(request: NextRequest) {
    try {
        const { firstName, lastName, currency } = await request.json();
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        await connectDB();

        const userDetails = await UserModel.findByIdAndUpdate(session.user?.id, {
            firstName,
            lastName,
            currency
        });

        return NextResponse.json({ message: 'User updated successfully'});
        




    } catch (error: any) {
        return NextResponse.json({
            message: error?.message || 'An error occurred',
        }, {
            status: 500
        });
    }
}
