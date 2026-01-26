import { Navbar } from "@/components/Navbar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ApprovalCard } from "@/components/ApprovalCard";

// Map roles to the statuses they can approve
const ROLE_APPROVAL_MAP: Record<string, string[]> = {
    VP_CLUBS: ["SUBMITTED"],
    ADMIN: ["VP_APPROVED"],
    SENIOR_ADMIN: ["ADMIN_PENDING", "ADMIN_PENDING_SENIOR"],
};

export default async function ApprovalsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Get user with role from database
    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
    });

    if (!user) {
        redirect("/login");
    }

    const userRole = user.role;
    const canApproveStatuses = ROLE_APPROVAL_MAP[userRole] || [];

    // If user can't approve anything, show message
    if (canApproveStatuses.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <Navbar user={session.user} />
                <main className="container py-8">
                    <h1 className="text-3xl font-bold mb-4">Approvals</h1>
                    <p className="text-muted-foreground">
                        You don&apos;t have permission to approve events. Only VP Clubs, Admin, and Senior Admin can approve.
                    </p>
                </main>
            </div>
        );
    }

    // Fetch events pending this user's approval
    const pendingEvents = await prisma.event.findMany({
        where: {
            status: {
                in: canApproveStatuses as any[],
            },
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    clubName: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <Navbar user={session.user} />
            <main className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Pending Approvals</h1>
                    <p className="text-muted-foreground mt-1">
                        Review and approve or reject event requests
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                        Logged in as: <strong>{user.name}</strong> ({userRole})
                    </p>
                </div>

                {pendingEvents.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border">
                        <p className="text-xl text-muted-foreground">🎉 No pending approvals!</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            All events requiring your approval have been processed.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {pendingEvents.map((event) => (
                            <ApprovalCard
                                key={event.id}
                                event={{
                                    id: event.id,
                                    name: event.name,
                                    description: event.description,
                                    venue: event.venue,
                                    eventDate: event.eventDate?.toISOString() || null,
                                    budget: event.budget,
                                    isMonetary: event.isMonetary,
                                    status: event.status,
                                    createdBy: event.createdBy,
                                    createdAt: event.createdAt.toISOString(),
                                }}
                                userRole={userRole}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
