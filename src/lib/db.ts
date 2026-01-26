import { prisma } from "./prisma";

export async function getAllEventsFromDB() {
    const events = await prisma.event.findMany({
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    clubName: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return events.map((event) => ({
        id: event.id,
        name: event.name,
        description: event.description,
        venue: event.venue,
        eventDate: event.eventDate?.toISOString() || null,
        budget: event.budget,
        isMonetary: event.isMonetary,
        status: event.status,
        createdById: event.createdById,
        postEventNotes: event.postEventNotes,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
        createdBy: event.createdBy,
    }));
}

export async function getEventStatsFromDB() {
    const events = await prisma.event.findMany();

    const total = events.length;
    const pending = events.filter((e) =>
        ["SUBMITTED", "VP_APPROVED", "ADMIN_PENDING", "ADMIN_PENDING_SENIOR"].includes(e.status)
    ).length;
    const approved = events.filter((e) => e.status === "APPROVED").length;
    const completed = events.filter((e) =>
        ["COMPLETED", "CLOSED"].includes(e.status)
    ).length;
    const rejected = events.filter((e) => e.status === "REJECTED").length;

    return { total, pending, approved, completed, rejected };
}
