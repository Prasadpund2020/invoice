import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import SettingModel from '@/models/settings.model';
import { connectDB } from '@/lib/connectDB';



//create and update 
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json(
                {
                    message: "unauthorized access...!!"
                },
                { status: 401 }
            );
        }

        const { logo, signature } = await request.json()

        await connectDB()
        const setting = await SettingModel.findOne({ userId: session.user.id });


        const payload = {
            userId: session.user.id,
            ...(logo && { invoiceLogo: logo }),
            ...(signature && { signature: signature }),
        }


        //update document
        if (setting) {
            const updateSetting = await SettingModel.findByIdAndUpdate(setting._id, payload);
            return NextResponse.json({
                message: "setting updated succesfully"
            })


        }
        //create the document 
        const createSetting = await SettingModel.create(payload)

        return NextResponse.json({
            message: "setting updated succesfully"
        })




    } catch (error: any) {
        return NextResponse.json(
            {
                message: error?.message || "something went wrong"
            },
            { status: 500 }
        );
    }
}


//get data
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json(
                {
                    message: "unauthorized access...!!"
                },
                { status: 401 }
            );
        }

        await connectDB();
        const getData = await SettingModel.findOne({ userId: session.user.id });

        return NextResponse.json({
            message: "success",
            data: getData
        });

    } catch (error: any) {
        return NextResponse.json(
            {
                message: error?.message || "something went wrong"
            },
            { status: 500 }
        );
    }
}
