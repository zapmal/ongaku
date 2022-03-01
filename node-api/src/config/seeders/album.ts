import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Regular user, no verified email.
  const btsAlbum = await prisma.album.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'The Album',
      year: new Date(),
      releaseType: 'EP',
      cover: '',
      artistId: 2,
    },
  });
  console.log({ btsAlbum });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
