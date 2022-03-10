import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const fSong = await prisma.song.upsert({
    where: { id: 7 },
    update: {},
    create: {
      artistId: 2,
      name: 'THE SONGG',
      path: 'example.mp3',
      albumId: 1,
      isExplicit: false,
    },
  });

  // await prisma.song.update({
  //   where: {
  //     id: 7,
  //   },
  //   data: {
  //     artist: {
  //       connect: [{ id: 1 }, { id: 3 }, { id: 2}],
  //     },
  //   },
  // });

  // const query = await prisma.song.findUnique({
  //   where: { id: 7 },
  //   include: {
  //     artist: true,
  //   },
  // });
  console.log({ fSong });

  // console.log({ ...query });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
