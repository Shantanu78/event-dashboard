"use client";

import { EventStatus, STATUS_LABELS, STATUS_COLORS } from "@/types";
import { cn } from "@/lib/utils";
import {
    FileText,
    UserCheck,
    Shield,
    Wallet,
    CheckCircle2,
    PartyPopper,
    Camera,
    XCircle
} from "lucide-react";

interface StatusTimelineProps {
    currentStatus: EventStatus;
    isMonetary: boolean;
}

const STAGES = [
    { status: "SUBMITTED", label: "Form Submitted", icon: FileText },
    { status: "VP_APPROVED", label: "VP Approved", icon: UserCheck },
    { status: "ADMIN_PENDING", label: "Admin Review", icon: Shield },
    { status: "ADMIN_PENDING_SENIOR", label: "Senior Confirmation", icon: Wallet, monetaryOnly: true },
    { status: "APPROVED", label: "Approved", icon: CheckCircle2 },
    { status: "COMPLETED", label: "Event Done", icon: PartyPopper },
    { status: "CLOSED", label: "Marketing Done", icon: Camera },
];

export function StatusTimeline({ currentStatus, isMonetary }: StatusTimelineProps) {
    const filteredStages = STAGES.filter(
        (stage) => !stage.monetaryOnly || isMonetary
    );

    const currentIndex = filteredStages.findIndex(
        (stage) => stage.status === currentStatus
    );

    if (currentStatus === "REJECTED") {
        return (
            <div className="flex items-center gap-2 text-red-500">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Event Rejected</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1 overflow-x-auto py-2">
            {filteredStages.map((stage, index) => {
                const Icon = stage.icon;
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <div key={stage.status} className="flex items-center">
                        <div
                            className={cn(
                                "flex flex-col items-center gap-1 px-2",
                                isCompleted && "text-green-500",
                                isCurrent && "text-blue-500",
                                !isCompleted && !isCurrent && "text-muted-foreground"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2",
                                    isCompleted && "border-green-500 bg-green-500/10",
                                    isCurrent && "border-blue-500 bg-blue-500/10 animate-pulse",
                                    !isCompleted && !isCurrent && "border-muted"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                            <span className="text-xs whitespace-nowrap">{stage.label}</span>
                        </div>
                        {index < filteredStages.length - 1 && (
                            <div
                                className={cn(
                                    "h-0.5 w-6 mt-[-1rem]",
                                    isCompleted ? "bg-green-500" : "bg-muted"
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
