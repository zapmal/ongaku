import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      fullName: 'Alice Wallace',
      birthdate: new Date(),
      username: 'alicey',
      password: await hash('password', 10),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      fullName: 'Bob Beatley',
      birthdate: new Date(),
      username: 'bobbey',
      password: await hash('password', 10),
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ongaku.com' },
    update: {},
    create: {
      email: 'admin@ongaku.com',
      fullName: 'Admin',
      birthdate: new Date(),
      username: 'admin',
      role: 'ADMIN',
      password: await hash('password', 10),
    },
  });

  const iverson = await prisma.artist.upsert({
    where: { email: 'yungiverson@gmail.com' },
    update: {},
    create: {
      email: 'yungiverson@gmail.com',
      country: 'Venezuela',
      artisticName: 'iverson',
      genres: ['rap', 'raro'],
      yearsActive: new Date(),
      labels: ['Arrecho Records'],
      password: await hash('password', 10),
    },
  });

  const bts = await prisma.artist.upsert({
    where: { email: 'contact@btsbighit.com' },
    update: {},
    create: {
      email: 'contact@btsbighit.com',
      password: await hash('password', 10),
      country: 'Korea',
      labels: ['BigHit'],
      genres: ['pop', 'rap'],
      yearsActive: new Date(),
      band: {
        create: {
          name: 'BTS',
          members: ['Jimin', 'SUGA', 'RM'],
        },
      },
    },
  });

  const manager = await prisma.manager.upsert({
    where: { userId: bob.id },
    update: {},
    create: {
      artistId: iverson.id,
      userId: bob.id,
    },
  });

  console.log({ alice, bob, iverson, bts, admin, manager });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
