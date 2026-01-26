import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash the password
  const hashedPassword = await bcrypt.hash("EDB1234", 10);

  // Create Event Creator (PRESIDENT role) - Clubhead
  const eventCreator = await prisma.user.upsert({
    where: { email: "Shantanucat2024@gmail.com" },
    update: {
      password: hashedPassword,
      role: "PRESIDENT",
      name: "Clubhead",
      clubName: "Tech Club",
    },
    create: {
      email: "Shantanucat2024@gmail.com",
      name: "Clubhead",
      password: hashedPassword,
      role: "PRESIDENT",
      clubName: "Tech Club",
    },
  });

  // Create Approver (VP_CLUBS role) - Admin
  const approver = await prisma.user.upsert({
    where: { email: "Parihar.shantanusingh78@gmail.com" },
    update: {
      password: hashedPassword,
      role: "VP_CLUBS",
      name: "Admin",
    },
    create: {
      email: "Parihar.shantanusingh78@gmail.com",
      name: "Admin",
      password: hashedPassword,
      role: "VP_CLUBS",
    },
  });

  console.log("✅ Created users:");
  console.log(`   - ${eventCreator.name}: ${eventCreator.email} (${eventCreator.role})`);
  console.log(`   - ${approver.name}: ${approver.email} (${approver.role})`);

  // Create dummy events at different stages
  const events = [
    {
      name: "Annual Tech Fest 2026",
      description: "The biggest technical festival of the year featuring hackathons, workshops, and guest lectures from industry leaders.",
      venue: "Main Auditorium",
      eventDate: new Date("2026-02-15T10:00:00Z"),
      budget: 150000,
      isMonetary: true,
      status: "APPROVED" as const,
      createdById: eventCreator.id,
    },
    {
      name: "Cultural Night",
      description: "An evening of music, dance, and drama performances by various college clubs.",
      venue: "Open Air Theatre",
      eventDate: new Date("2026-02-20T18:00:00Z"),
      budget: 0,
      isMonetary: false,
      status: "VP_APPROVED" as const,
      createdById: eventCreator.id,
    },
    {
      name: "Startup Pitch Competition",
      description: "Students pitch their startup ideas to a panel of investors and mentors.",
      venue: "Conference Hall B",
      eventDate: new Date("2026-03-01T14:00:00Z"),
      budget: 50000,
      isMonetary: true,
      status: "ADMIN_PENDING_SENIOR" as const,
      createdById: eventCreator.id,
    },
    {
      name: "Photography Workshop",
      description: "Learn the basics of photography from professional photographers.",
      venue: "Room 301",
      eventDate: new Date("2026-01-30T11:00:00Z"),
      budget: 0,
      isMonetary: false,
      status: "SUBMITTED" as const,
      createdById: eventCreator.id,
    },
    {
      name: "Alumni Meet 2026",
      description: "Annual gathering of alumni with networking sessions and panel discussions.",
      venue: "Grand Ballroom",
      eventDate: new Date("2026-04-10T10:00:00Z"),
      budget: 200000,
      isMonetary: true,
      status: "COMPLETED" as const,
      createdById: eventCreator.id,
      postEventNotes: "Event was a huge success with 500+ attendees.",
    },
    {
      name: "Debate Competition",
      description: "Inter-college debate championship on current affairs.",
      venue: "Seminar Hall",
      eventDate: new Date("2026-02-08T09:00:00Z"),
      budget: 0,
      isMonetary: false,
      status: "REJECTED" as const,
      createdById: eventCreator.id,
    },
  ];

  console.log("\n📅 Creating events...");

  for (const eventData of events) {
    const event = await prisma.event.upsert({
      where: {
        id: `seed-${eventData.name.toLowerCase().replace(/\s+/g, '-')}`
      },
      update: eventData,
      create: {
        id: `seed-${eventData.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...eventData,
      },
    });
    console.log(`   ✓ ${event.name} (${event.status})`);
  }

  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
