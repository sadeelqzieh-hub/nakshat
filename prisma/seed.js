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

    const existingProjects = await prisma.project.findMany({
      where: { userId: clientUser.id },
    });

    if (existingProjects.length === 0) {
      await prisma.project.createMany({
        data: [
          {
            name: "Restaurant Branding",
            service: "Brand Identity",
            status: "In Progress",
            deadline: "2026-04-10",
            userId: clientUser.id,
          },
          {
            name: "Summer Campaign",
            service: "Social Media Ads",
            status: "Pending Approval",
            deadline: "2026-04-15",
            userId: clientUser.id,
          },
          {
            name: "Promo Video Launch",
            service: "Video Production",
            status: "Completed",
            deadline: "2026-04-20",
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