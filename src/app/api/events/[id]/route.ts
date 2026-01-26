import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH update event status (for approvals)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { status, comments } = body;

        // Find the user in the database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if user has permission to approve based on their role
        const rolePermissions: Record<string, string[]> = {
            VP_CLUBS: ["SUBMITTED"],
            ADMIN: ["VP_APPROVED"],
            SENIOR_ADMIN: ["ADMIN_PENDING", "ADMIN_PENDING_SENIOR"],
            OPSCOMM: ["APPROVED"],
            MARKETING: ["APPROVED"],
        };

        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        // Update event status
        const updatedEvent = await prisma.event.update({
            where: { id },
            data: { status },
        });

        // Create approval record
        await prisma.approval.create({
            data: {
                eventId: id,
                approverId: user.id,
                status: status === "REJECTED" ? "rejected" : "approved",
                comments: comments || null,
            },
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json(
            { error: "Failed to update event" },
            { status: 500 }
        );
    }
}

// GET single event
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                approvals: {
                    include: {
                        approver: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            { error: "Failed to fetch event" },
            { status: 500 }
        );
    }
}
