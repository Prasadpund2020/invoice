import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongodb-client";
import Resend from "next-auth/providers/resend";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            firstName: string;
            lastName: string;
            currency?: string;
        } & DefaultSession["user"];
    }
    interface User {
        id: string;
        email: string;
        name: string;
        image?: string;
        currency?: string;
    }
}

export const authOptions = {
    adapter: MongoDBAdapter(client),
    providers: [
        Resend({
            from: "generate-invoice <onboarding@resend.dev>",
        }),
    ],
    pages: {
        error: "/login",
        verifyRequest: "/verify-email",
        signIn: "/login",
    },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
