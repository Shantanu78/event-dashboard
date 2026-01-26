import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash the password
  const hashedPassword = await bcrypt.hash("EDB1234", 10);

  // Create Event Creator (PRESIDENT role)
  const eventCreator = await prisma.user.upsert({
    where: { email: "Shantanucat2024@gmail.com" },
    update: {
      password: hashedPassword,
      role: "PRESIDENT",
    },
    create: {
      email: "Shantanucat2024@gmail.com",
      name: "Event Creator",
      password: hashedPassword,
      role: "PRESIDENT",
      clubName: "Tech Club",
    },
  });

  // Create Approver (VP_CLUBS role)
  const approver = await prisma.user.upsert({
    where: { email: "Parihar.shantanusingh78@gmail.com" },
    update: {
      password: hashedPassword,
      role: "VP_CLUBS",
    },
    create: {
      email: "Parihar.shantanusingh78@gmail.com",
      name: "Approver",
      password: hashedPassword,
      role: "VP_CLUBS",
    },
  });

  console.log("✅ Created users:");
  console.log(`   - Event Creator: ${eventCreator.email} (${eventCreator.role})`);
  console.log(`   - Approver: ${approver.email} (${approver.role})`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
