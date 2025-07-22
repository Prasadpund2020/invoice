"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/Signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            router.push("/login");
        } else {
            const data = await res.json();
            setError(data.message || "Something went wrong.");
        }
    };

    return (
        <Card className="max-w-sm min-w-xs lg:min-w-sm">
            <CardHeader>
                <CardTitle className="text-xl w-full">Sign up</CardTitle>
                <CardDescription>Create your account to get started</CardDescription>
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
                    <SubmitButton title="Sign up" />
                </form>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="underline hover:text-primary">
                        Login
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
