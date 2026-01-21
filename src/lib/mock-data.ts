import { Event, EventStatus } from "@/types";

// Mock data for development - will be replaced with real DB calls
export const MOCK_EVENTS: Event[] = [
    {
        id: "1",
        name: "Annual Tech Fest 2026",
        description: "The biggest technical festival of the year featuring hackathons, workshops, and guest lectures from industry leaders.",
        venue: "Main Auditorium",
        eventDate: "2026-02-15T10:00:00Z",
        budget: 150000,
        isMonetary: true,
        status: "APPROVED",
        createdById: "user1",
        postEventNotes: null,
        createdAt: "2026-01-10T08:00:00Z",
        updatedAt: "2026-01-20T14:00:00Z",
    },
    {
        id: "2",
        name: "Cultural Night",
        description: "An evening of music, dance, and drama performances by various college clubs.",
        venue: "Open Air Theatre",
        eventDate: "2026-02-20T18:00:00Z",
        budget: 0,
        isMonetary: false,
        status: "VP_APPROVED",
        createdById: "user2",
        postEventNotes: null,
        createdAt: "2026-01-15T10:00:00Z",
        updatedAt: "2026-01-18T11:00:00Z",
    },
    {
        id: "3",
        name: "Startup Pitch Competition",
        description: "Students pitch their startup ideas to a panel of investors and mentors.",
        venue: "Conference Hall B",
        eventDate: "2026-03-01T14:00:00Z",
        budget: 50000,
        isMonetary: true,
        status: "ADMIN_PENDING_SENIOR",
        createdById: "user3",
        postEventNotes: null,
        createdAt: "2026-01-12T09:00:00Z",
        updatedAt: "2026-01-19T16:00:00Z",
    },
    {
        id: "4",
        name: "Photography Workshop",
        description: "Learn the basics of photography from professional photographers.",
        venue: "Room 301",
        eventDate: "2026-01-30T11:00:00Z",
        budget: 0,
        isMonetary: false,
        status: "SUBMITTED",
        createdById: "user4",
        postEventNotes: null,
        createdAt: "2026-01-20T08:00:00Z",
        updatedAt: "2026-01-20T08:00:00Z",
    },
    {
        id: "5",
        name: "Alumni Meet 2026",
        description: "Annual gathering of alumni with networking sessions and panel discussions.",
        venue: "Grand Ballroom",
        eventDate: "2026-04-10T10:00:00Z",
        budget: 200000,
        isMonetary: true,
        status: "COMPLETED",
        createdById: "user1",
        postEventNotes: "Event was a huge success with 500+ attendees.",
        createdAt: "2026-01-05T08:00:00Z",
        updatedAt: "2026-01-21T18:00:00Z",
    },
    {
        id: "6",
        name: "Debate Competition",
        description: "Inter-college debate championship on current affairs.",
        venue: "Seminar Hall",
        eventDate: "2026-02-08T09:00:00Z",
        budget: 0,
        isMonetary: false,
        status: "REJECTED",
        createdById: "user5",
        postEventNotes: null,
        createdAt: "2026-01-08T10:00:00Z",
        updatedAt: "2026-01-14T12:00:00Z",
    },
];

export function getEventsByStatus(status: EventStatus): Event[] {
    return MOCK_EVENTS.filter((event) => event.status === status);
}

export function getEventById(id: string): Event | undefined {
    return MOCK_EVENTS.find((event) => event.id === id);
}

export function getAllEvents(): Event[] {
    return MOCK_EVENTS;
}

export function getEventStats() {
    const total = MOCK_EVENTS.length;
    const pending = MOCK_EVENTS.filter((e) =>
        ["SUBMITTED", "VP_APPROVED", "ADMIN_PENDING", "ADMIN_PENDING_SENIOR"].includes(e.status)
    ).length;
    const approved = MOCK_EVENTS.filter((e) => e.status === "APPROVED").length;
    const completed = MOCK_EVENTS.filter((e) =>
        ["COMPLETED", "CLOSED"].includes(e.status)
    ).length;
    const rejected = MOCK_EVENTS.filter((e) => e.status === "REJECTED").length;

    return { total, pending, approved, completed, rejected };
}
