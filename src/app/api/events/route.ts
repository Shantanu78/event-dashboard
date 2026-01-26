import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all events
export async function GET() {
    try {
        const events = await prisma.event.findMany({
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
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

// POST create new event
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description, venue, eventDate, isMonetary, budget, clubName } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Event name is required" },
                { status: 400 }
            );
        }

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

        // Ensure only Presidents can create events
        if (user.role !== "PRESIDENT") {
            return NextResponse.json(
                { error: "Only Club Presidents can create events" },
                { status: 403 }
            );
        }

        const event = await prisma.event.create({
            data: {
                name,
                description: description || null,
                venue: venue || null,
                eventDate: eventDate ? new Date(eventDate) : null,
                isMonetary: isMonetary || false,
                budget: budget || 0,
                status: "SUBMITTED",
                createdById: user.id,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Failed to create event" },
            { status: 500 }
        );
    }
}
