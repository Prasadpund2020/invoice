import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { DefaultSession } from "next-auth";

// ✅ Type augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      currency?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    currency?: string;
  }
}

declare module "next-auth" {
  interface JWT {
    id?: string;
    firstName?: string;
    lastName?: string;
    currency?: string;
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Received credentials:", credentials); // 👈 debug log
        await connectDB();

        const user = await User.findOne({ email: credentials?.email });
        console.log(user); // 👈 debug log

        if (!user || !user.hashedPassword) {
          console.log("User not found or no hashed password.");
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password as string,
          user.hashedPassword as string
        );
        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          currency: user.currency,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ✅ Handles token creation during login
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.currency = user.currency;
        
        
      }
      return token;
    },

    // ✅ This part is UPDATED to always pull fresh data from DB
    async session({ session }) {
  if (!session.user?.email) return session;

  await connectDB();
  const dbUser = await User.findOne({ email: session.user.email });

  if (dbUser) {
    session.user.id = dbUser._id.toString();
    session.user.firstName = dbUser.firstName;
    session.user.lastName = dbUser.lastName;
    session.user.currency = dbUser.currency;
  }

  return session;
}

  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
