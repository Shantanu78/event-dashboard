"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome } from "lucide-react";

export default function LoginPage() {
    const handleGoogleSignIn = async () => {
        // Will redirect to Google OAuth
        window.location.href = "/api/auth/signin/google";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                        E
                    </div>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to access the Event Dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={handleGoogleSignIn}
                        className="w-full gap-2"
                        variant="outline"
                        size="lg"
                    >
                        <Chrome className="h-5 w-5" />
                        Continue with Google
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Only @bitsom.edu.in emails are allowed for approvers.
                        <br />
                        Club presidents can use any email.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
