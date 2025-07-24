const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.task.deleteMany();
  await prisma.board.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  const member = await prisma.user.create({
    data: {
      email: 'member@example.com',
      password,
      name: 'Member',
    },
  });

  const team = await prisma.team.create({
    data: {
      name: 'Awesome team',
      members: {
        connect: [{ id: admin.id }, { id: member.id }],
      },
    },
  });

  const board = await prisma.board.create({
    data: {
      title: 'Sprint board',
      team: {
        connect: { id: team.id },
      },
    },
  });

  await prisma.task.create({
    data: {
      title: 'Setup project',
      content: 'Initial project setup',
      status: 'todo',
      assigned: { connect: { id: admin.id } },
      board: { connect: { id: board.id } },
    },
  });

  await prisma.message.create({
    data: {
      content: 'Welcome to the team chat!',
      user: { connect: { id: admin.id } },
      team: { connect: { id: team.id } },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
