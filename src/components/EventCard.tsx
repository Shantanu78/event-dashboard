"use client";

import { Event, STATUS_LABELS, STATUS_COLORS } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusTimeline } from "./StatusTimeline";
import { Calendar, MapPin, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
    event: Event;
    onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
    const formattedDate = event.eventDate
        ? new Date(event.eventDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : "TBD";

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
                "border-l-4",
                event.status === "REJECTED" ? "border-l-red-500" : "border-l-blue-500"
            )}
            onClick={onClick}
        >
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-1">{event.name}</CardTitle>
                    <Badge
                        className={cn(
                            "text-white shrink-0",
                            STATUS_COLORS[event.status]
                        )}
                    >
                        {STATUS_LABELS[event.status]}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description || "No description provided"}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                    </div>
                    {event.venue && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.venue}</span>
                        </div>
                    )}
                    {event.isMonetary && (
                        <div className="flex items-center gap-1 text-amber-600">
                            <Wallet className="h-4 w-4" />
                            <span>₹{event.budget.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <StatusTimeline
                    currentStatus={event.status}
                    isMonetary={event.isMonetary}
                />
            </CardContent>
        </Card>
    );
}
