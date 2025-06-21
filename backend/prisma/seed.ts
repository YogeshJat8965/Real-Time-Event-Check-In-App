// backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding events...");

  
  await prisma.event.deleteMany();

  
  const events = await prisma.event.createMany({
    data: [
      {
        name: "Startup Pitch Night",
        location: "Innovation Hub",
        startTime: new Date("2025-08-01T18:00:00Z"),
      },
      {
        name: "Blockchain Bootcamp",
        location: "Tech Lab 3",
        startTime: new Date("2025-08-05T09:30:00Z"),
      },
      {
        name: "Photography Walk",
        location: "City Park Entrance",
        startTime: new Date("2025-08-10T07:00:00Z"),
      },
      {
        name: "Gaming LAN Party",
        location: "Recreational Hall",
        startTime: new Date("2025-08-15T20:00:00Z"),
      },
      {
        name: "Hackathon Finale",
        location: "Auditorium B",
        startTime: new Date("2025-08-20T10:00:00Z"),
      },
    ],
  });

  console.log("Event seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
