import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Regular user, no verified email.
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

  // Manager (scroll down), verified email.
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      fullName: 'Bob Beatley',
      birthdate: new Date(),
      username: 'bobbey',
      password: await hash('password', 10),
      userMetadata: {
        create: {
          verifiedEmail: true,
          ipAddress: '192.168.1.1',
        },
      },
    },
  });

  // Administrator, verified email.
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
      userMetadata: {
        create: {
          verifiedEmail: true,
          ipAddress: '192.168.1.1',
        },
      },
    },
  });

  // Artist, verified email.
  const iverson = await prisma.artist.upsert({
    where: { email: 'yungiverson@gmail.com' },
    update: {
      country: 'VE',
    },
    create: {
      email: 'yungiverson@gmail.com',
      country: 'VE',
      artisticName: 'iverson',
      genres: ['rap', 'raro'],
      yearsActive: 4,
      labels: ['Arrecho Records'],
      verifiedEmail: true,
      password: await hash('password', 10),
    },
  });

  // Artist (group), verified email.
  const bts = await prisma.artist.upsert({
    where: { email: 'contact@btsbighit.com' },
    update: {
      country: 'KR',
    },
    create: {
      email: 'contact@btsbighit.com',
      password: await hash('password', 10),
      country: 'KR',
      labels: ['BigHit'],
      genres: ['pop', 'rap'],
      yearsActive: 2,
      verifiedEmail: true,
      band: {
        create: {
          name: 'BTS',
          members: ['Jimin', 'SUGA', 'RM'],
        },
      },
    },
  });

  // Make Bob iverson's manager.
  const manager = await prisma.manager.upsert({
    where: { userId: bob.id },
    update: {
      user: {
        update: {
          role: 'MANAGER',
        },
      },
    },
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
