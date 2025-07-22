import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/user.model";

export default async function ProtectedPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    await connectDB();
    const user = await UserModel.findById(session.user.id);

    if (!user) {
        redirect("/login");
    }

    if (!user.firstName || !user.lastName || !user.currency) {
        redirect("/x-onboarding");
    }

    return null;
}


//component for unprotected page
