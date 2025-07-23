"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/admin/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, oldPassword: currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setEmail("");
                setCurrentPassword("");
                setNewPassword("");
            } else {
                setError(data.error || "Failed to update password.");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Update Admin Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div>
                            <Label>Email</Label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                type="email"
                            />
                        </div>
                        <div>
                            <Label>Current Password</Label>
                            <Input
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                type="password"
                            />
                        </div>
                        <div>
                            <Label>New Password</Label>
                            <Input
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                type="password"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {message && <p className="text-green-500 text-sm">{message}</p>}
                        <Button type="submit">Update Password</Button>
                    </form>

                    {/* Return to login link */}
                    <p
                        className="mt-4 text-sm text-center text-blue-600 hover:underline cursor-pointer"
                        onClick={() => router.push("/admin/login")}
                    >
                        Return to Login
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
