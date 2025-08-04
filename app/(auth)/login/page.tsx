"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/SubmitButton";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError("Invalid email or password.");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <Card className="max-w-sm min-w-xs lg:min-w-sm">
            <CardHeader>
                <CardTitle className="text-xl w-full"> Organisation Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input
                            className="mt-2"
                            placeholder="hello@xyz.com"
                            required
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Password</Label>
                        <Input
                            className="mt-2"
                            placeholder="********"
                            required
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <SubmitButton title="Login" />
                </form>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <p className="mt-4 text-sm text-center">
                    Don&apos;t have an account?{" "}
                    <span
                        onClick={() => router.push("/Signup")}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Sign up
                    </span>
                </p>
            </CardContent>
        </Card>
    );
}
