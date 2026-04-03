const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Company User",
      email: "company@test.com",
      password: "123456",
      role: "company",
    },
    {
      name: "Client User",
      email: "client@test.com",
      password: "123456",
      role: "client",
    },
    {
      name: "Designer User",
      email: "designer@test.com",
      password: "123456",
      role: "designer",
    },
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });
  }

  const clientUser = await prisma.user.findUnique({
    where: { email: "client@test.com" },
  });

  if (clientUser) {
    await prisma.clientProfile.upsert({
      where: { userId: clientUser.id },
      update: {
        companyName: "Taste House",
        businessType: "Restaurant",
        contactPerson: "Ahmad Khaled",
        phone: "+970 59 123 4567",
        location: "Nablus",
        packageName: "Premium Marketing Package",
        contractStart: "2026-04-01",
        contractStatus: "Active",
        website: "https://www.tastehouse.com",
        socialMedia: "Instagram: @tastehouse.ps",
      },
      create: {
        companyName: "Taste House",
        businessType: "Restaurant",
        contactPerson: "Ahmad Khaled",
        phone: "+970 59 123 4567",
        location: "Nablus",
        packageName: "Premium Marketing Package",
        contractStart: "2026-04-01",
        contractStatus: "Active",
        website: "https://www.tastehouse.com",
        socialMedia: "Instagram: @tastehouse.ps",
        userId: clientUser.id,
      },
    });

    const existingDesigns = await prisma.clientDesign.findMany({
      where: { userId: clientUser.id },
    });

    if (existingDesigns.length === 0) {
      await prisma.clientDesign.createMany({
        data: [
          {
            title: "Logo Concepts",
            type: "Brand Identity",
            date: "2026-04-03",
            status: "Waiting Review",
            note: "Please review the main logo direction and color palette.",
            previewPath: null,
            userId: clientUser.id,
          },
          {
            title: "Instagram Story Set",
            type: "Social Media Design",
            date: "2026-04-05",
            status: "Approved",
            note: "Approved by client and ready for publishing.",
            previewPath: null,
            userId: clientUser.id,
          },
        ],
      });
    }

    const existingVideos = await prisma.clientVideo.findMany({
      where: { userId: clientUser.id },
    });

    if (existingVideos.length === 0) {
      await prisma.clientVideo.createMany({
        data: [
          {
            title: "Restaurant Promo Video",
            type: "Promotional Video",
            date: "2026-04-08",
            status: "Waiting Review",
            note: "Please review the final promo version before publishing.",
            videoPath: null,
            userId: clientUser.id,
          },
          {
            title: "Behind The Scenes Reel",
            type: "Short Reel",
            date: "2026-04-10",
            status: "Approved",
            note: "Approved and ready for posting.",
            videoPath: null,
            userId: clientUser.id,
          },
        ],
      });
    }
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });