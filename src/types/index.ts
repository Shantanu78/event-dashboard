export type EventStatus =
    | "SUBMITTED"
    | "VP_APPROVED"
    | "ADMIN_PENDING"
    | "ADMIN_PENDING_SENIOR"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED"
    | "CLOSED";

export type UserRole =
    | "PRESIDENT"
    | "VP_CLUBS"
    | "ADMIN"
    | "SENIOR_ADMIN"
    | "OPSCOMM"
    | "MARKETING";

export interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: UserRole;
    clubName: string | null;
}

export interface Event {
    id: string;
    name: string;
    description: string | null;
    venue: string | null;
    eventDate: string | null;
    budget: number;
    isMonetary: boolean;
    status: EventStatus;
    createdById: string;
    createdBy?: User;
    postEventNotes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Approval {
    id: string;
    eventId: string;
    approverId: string;
    approver?: User;
    status: "approved" | "rejected";
    comments: string | null;
    createdAt: string;
}

export const STATUS_LABELS: Record<EventStatus, string> = {
    SUBMITTED: "Pending VP Approval",
    VP_APPROVED: "Pending Admin Approval",
    ADMIN_PENDING: "Under Admin Review",
    ADMIN_PENDING_SENIOR: "Awaiting Senior Confirmation",
    APPROVED: "Approved - Ready for Ops",
    REJECTED: "Rejected",
    COMPLETED: "Event Completed",
    CLOSED: "Closed",
};

export const STATUS_COLORS: Record<EventStatus, string> = {
    SUBMITTED: "bg-yellow-500",
    VP_APPROVED: "bg-blue-500",
    ADMIN_PENDING: "bg-orange-500",
    ADMIN_PENDING_SENIOR: "bg-purple-500",
    APPROVED: "bg-green-500",
    REJECTED: "bg-red-500",
    COMPLETED: "bg-teal-500",
    CLOSED: "bg-gray-500",
};
