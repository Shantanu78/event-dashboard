"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Wallet, User, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";

interface ApprovalCardProps {
    event: {
        id: string;
        name: string;
        description: string | null;
        venue: string | null;
        eventDate: string | null;
        budget: number;
        isMonetary: boolean;
        status: string;
        createdBy: {
            id: string;
            name: string | null;
            email: string;
            clubName: string | null;
        };
        createdAt: string;
    };
    userRole: string;
}

// Map current status to next status on approval
const NEXT_STATUS_MAP: Record<string, string> = {
    SUBMITTED: "VP_APPROVED",
    VP_APPROVED: "ADMIN_PENDING",
    ADMIN_PENDING: "APPROVED",
    ADMIN_PENDING_SENIOR: "APPROVED",
};

export function ApprovalCard({ event, userRole }: ApprovalCardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState("");

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const nextStatus = NEXT_STATUS_MAP[event.status] || "APPROVED";

            const response = await fetch(`/api/events/${event.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: nextStatus,
                    comments: comments || `Approved by ${userRole}`,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to approve event");
            }

            toast.success("Event approved!", {
                description: `${event.name} has been moved to ${nextStatus}`,
            });

            router.refresh();
        } catch (error) {
            toast.error("Failed to approve event");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!comments.trim()) {
            toast.error("Please provide a reason for rejection");
            setShowComments(true);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/events/${event.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "REJECTED",
                    comments,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to reject event");
            }

            toast.success("Event rejected", {
                description: `${event.name} has been rejected`,
            });

            router.refresh();
        } catch (error) {
            toast.error("Failed to reject event");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">{event.name}</CardTitle>
                        <CardDescription className="mt-1">
                            Submitted by {event.createdBy.name || event.createdBy.email}
                            {event.createdBy.clubName && ` (${event.createdBy.clubName})`}
                        </CardDescription>
                    </div>
                    <Badge className={STATUS_COLORS[event.status as keyof typeof STATUS_COLORS] || "bg-gray-500"}>
                        {STATUS_LABELS[event.status as keyof typeof STATUS_LABELS] || event.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {event.eventDate && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(event.eventDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            })}</span>
                        </div>
                    )}
                    {event.venue && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.venue}</span>
                        </div>
                    )}
                    {event.isMonetary && (
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            <span>₹{event.budget.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{event.createdBy.name || "Unknown"}</span>
                    </div>
                </div>

                {showComments && (
                    <Textarea
                        placeholder="Add comments (required for rejection)..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={3}
                    />
                )}

                <div className="flex gap-3 pt-2">
                    <Button
                        onClick={handleApprove}
                        disabled={isLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                    </Button>
                    <Button
                        onClick={() => showComments ? handleReject() : setShowComments(true)}
                        disabled={isLoading}
                        variant="destructive"
                        className="flex-1"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
