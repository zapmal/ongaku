import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import * as objectHash from 'object-hash';
import * as dayjs from 'dayjs';

import { existsSync, readFile, writeFile } from 'fs';
import { extname } from 'path/posix';

const prisma = new PrismaClient();
const SEED_DATA = {
  images: {
    admin: {
      avatar: 's_admin.jpg',
      cover: 's_admin_cover.jpeg',
    },
    iverson: {
      avatar: 's_iverson.jpg',
      cover: null,
    },
    bts: {
      avatar: 's_bts.jpg',
      cover: 's_bts_cover.webp',
    },
    monsterSiren: {
      avatar: 's_monster_siren.jpg',
      cover: 's_monster_siren_cover.jpg',
    },
    gentlemen: {
      avatar: 's_the_gentlemen.jpg',
      cover: 's_the_gentlemen_cover.jpg',
    },
    demondice: {
      avatar: 's_demondice.jpeg',
      cover: 's_demondice_cover.webp',
    },
    joji: {
      avatar: 's_joji.jpg',
      cover: 's_joji_cover.jpg',
    },
    gidle: {
      avatar: 's_gidle.webp',
      cover: 's_gidle_cover.webp',
    },
    mori: {
      avatar: 's_mori.jpg',
      cover: 's_mori_cover.jpeg',
    },
    pvris: {
      avatar: 's_pvris.jpg',
      cover: null,
    },
    twice: {
      avatar: 's_twice.jpeg',
      cover: 's_twice_cover.png',
    },
    kda: {
      avatar: 's_kda.jpg',
      cover: 's_kda_cover.jpg',
    },
  },
  album: {
    iNeverDie: 's_i_never_die.jpg', // VILLAIN DIES, ALBUM
    iTrust: 's_i_trust.jpg', // Oh My God, ALBUM
    allOut: 's_all_out.jpg', // MORE, ALBUM (kda collab)
    kawakiWoAmeku: 's_kawaki_wo_ameku.jpg', // SAME NAME, SINGLE
    speedOfLight: 's_speed_of_light.png', // SAME NAME, SINGLE
    human: 's_human.jpg', // Human, ALBUM
  },
  song: {
    villainDies: 's_villain_dies.mp3',
    ohMyGod: 's_oh_my_god.mp3',
    more: 's_more.mp3',
    kawakiWoAmeku: 's_kawaki_wo_ameku.mp3',
    speedOfLight: 's_speed_of_light.mp3',
    human: 's_human.mp3',
  },
};

async function main() {
  try {
    const zero = await seed();

    console.log('Seeding done, EZ.', zero);
  } catch (error) {
    console.log('Error seeding', error);
  }
}

const seed = async () => {
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
      userMetadata: {
        create: {
          verifiedEmail: true,
          ipAddress: '192.168.1.1',
        },
      },
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

  let adminAvatar = null;
  if (!existsSync(`./assets/user/${SEED_DATA.images.admin.avatar}`)) {
    const storedAvatar = store('user', SEED_DATA.images.admin.avatar);
    adminAvatar = storedAvatar;
  }

  let adminBackground = null;
  if (!existsSync(`./assets/user/${SEED_DATA.images.admin.cover}`)) {
    const storedBackground = store('user', SEED_DATA.images.admin.cover);
    adminBackground = storedBackground;
  }

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
      avatar: adminAvatar,
      background: adminBackground,
      userMetadata: {
        create: {
          verifiedEmail: true,
          ipAddress: '192.168.1.1',
        },
      },
    },
  });

  let iversonAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.iverson.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.iverson.avatar);
    iversonAvatar = storedAvatar;
  }

  // Artist, verified email.
  const iverson = await prisma.artist.upsert({
    where: { email: 'yungiverson@gmail.com' },
    update: {},
    create: {
      email: 'yungiverson@gmail.com',
      country: 'VE',
      artisticName: 'iverson',
      genres: ['rap', 'raro'],
      yearsActive: 4,
      labels: ['Arrecho Records'],
      verifiedEmail: true,
      password: await hash('password', 10),
      avatar: iversonAvatar,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
    },
  });

  let gentlemenAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.gentlemen.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.gentlemen.avatar);
    gentlemenAvatar = storedAvatar;
  }

  let gentlemenCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.gentlemen.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.gentlemen.cover);
    gentlemenCover = storedCover;
  }

  const gentlemen = await prisma.artist.upsert({
    where: { email: 'gentlemen@gmail.com' },
    update: {},
    create: {
      email: 'gentlemen@gmail.com',
      password: await hash('password', 10),
      country: 'US',
      artisticName: 'gentlemen',
      labels: ['SelfMade Records'],
      genres: ['Rock', 'Alternative'],
      yearsActive: 3,
      avatar: gentlemenAvatar,
      artistInformation: {
        create: {
          coverImage: gentlemenCover,
        },
      },
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
      verifiedEmail: true,
    },
  });

  let btsAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.bts.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.bts.avatar);
    btsAvatar = storedAvatar;
  }

  let btsCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.bts.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.bts.cover);
    btsCover = storedCover;
  }

  // Artist (group), verified email.
  const bts = await prisma.artist.upsert({
    where: { email: 'contact@btsbighit.com' },
    update: {},
    create: {
      email: 'contact@btsbighit.com',
      password: await hash('password', 10),
      country: 'KR',
      labels: ['BigHit'],
      genres: ['pop', 'rap'],
      yearsActive: 2,
      verifiedEmail: true,
      avatar: btsAvatar,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
      artistInformation: {
        create: {
          coverImage: btsCover,
        },
      },
      band: {
        create: {
          name: 'bts',
          members: ['Jimin', 'SUGA', 'RM'],
        },
      },
    },
  });

  let monsterSirenAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.monsterSiren.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.monsterSiren.avatar);
    monsterSirenAvatar = storedAvatar;
  }

  let monsterSirenCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.monsterSiren.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.monsterSiren.cover);
    monsterSirenCover = storedCover;
  }

  const monsterSiren = await prisma.artist.upsert({
    where: { email: 'monster@gmail.com' },
    update: {},
    create: {
      email: 'monster@gmail.com',
      password: await hash('password', 10),
      country: 'CN',
      artisticName: 'monster-siren',
      labels: ['Hypergriph'],
      genres: ['Rock', 'Metal'],
      yearsActive: 2,
      avatar: monsterSirenAvatar,
      verifiedEmail: true,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
      artistInformation: {
        create: {
          coverImage: monsterSirenCover,
        },
      },
    },
  });

  let demondiceAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.demondice.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.demondice.avatar);
    demondiceAvatar = storedAvatar;
  }

  let demondiceCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.demondice.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.demondice.cover);
    demondiceCover = storedCover;
  }

  const demondice = await prisma.artist.upsert({
    where: { email: 'demondice@gmail.com' },
    update: {},
    create: {
      email: 'demondice@gmail.com',
      password: await hash('password', 10),
      country: 'JP',
      labels: ['Hololive'],
      genres: ['Rap', 'Rock'],
      yearsActive: 7,
      artisticName: 'demondice',
      avatar: demondiceAvatar,
      verifiedEmail: true,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
      artistInformation: {
        create: {
          coverImage: demondiceCover,
        },
      },
    },
  });

  let jojiAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.joji.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.joji.avatar);
    jojiAvatar = storedAvatar;
  }

  let jojiCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.joji.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.joji.cover);
    jojiCover = storedCover;
  }

  const joji = await prisma.artist.upsert({
    where: { email: 'joji@gmail.com' },
    update: {},
    create: {
      email: 'joji@gmail.com',
      password: await hash('password', 10),
      country: 'JP',
      artisticName: 'joji',
      labels: ['Selfmade Records'],
      genres: ['Rap'],
      yearsActive: 3,
      avatar: jojiAvatar,
      verifiedEmail: true,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
      artistInformation: {
        create: {
          coverImage: jojiCover,
        },
      },
    },
  });

  let gidleAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.gidle.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.gidle.avatar);
    gidleAvatar = storedAvatar;
  }

  let gidleCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.gidle.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.gidle.cover);
    gidleCover = storedCover;
  }

  const gidle = await prisma.artist.upsert({
    where: { email: 'gidle@gmail.com' },
    update: {},
    create: {
      email: 'gidle@gmail.com',
      password: await hash('password', 10),
      country: 'KR',
      labels: ['LEP'],
      genres: ['Pop'],
      yearsActive: 7,
      avatar: gidleAvatar,
      verifiedEmail: true,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
      band: {
        create: {
          name: 'gidle',
          members: ['SOYEON', 'SOYEON2', 'SOYEON3', 'FILLER'],
        },
      },
      artistInformation: {
        create: {
          coverImage: gidleCover,
        },
      },
    },
  });

  let moriAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.mori.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.mori.avatar);
    moriAvatar = storedAvatar;
  }

  let moriCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.mori.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.mori.cover);
    moriCover = storedCover;
  }

  const mori = await prisma.artist.upsert({
    where: { email: 'mori@gmail.com' },
    update: {},
    create: {
      email: 'mori@gmail.com',
      password: await hash('password', 10),
      country: 'JP',
      artisticName: 'mori-calliope',
      labels: ['Hololive'],
      genres: ['Pop'],
      yearsActive: 3,
      avatar: moriAvatar,
      verifiedEmail: true,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
      artistInformation: {
        create: {
          coverImage: moriCover,
        },
      },
    },
  });

  let pvrisAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.pvris.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.pvris.avatar);
    pvrisAvatar = storedAvatar;
  }

  const pvris = await prisma.artist.upsert({
    where: { email: 'pvris@gmail.com' },
    update: {},
    create: {
      email: 'pvris@gmail.com',
      password: await hash('password', 10),
      artisticName: 'pvris',
      country: 'US',
      labels: ['Toute Records'],
      genres: ['Rap'],
      yearsActive: 8,
      avatar: pvrisAvatar,
      verifiedEmail: true,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
    },
  });

  let twiceAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.twice.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.twice.avatar);
    twiceAvatar = storedAvatar;
  }

  let twiceCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.twice.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.twice.cover);
    twiceCover = storedCover;
  }

  const twice = await prisma.artist.upsert({
    where: { email: 'twice@gmail.com' },
    update: {},
    create: {
      email: 'twice@gmail.com',
      password: await hash('password', 10),
      country: 'KR',
      labels: ['P0P Entertainment'],
      genres: ['Pop'],
      yearsActive: 5,
      avatar: twiceAvatar,
      verifiedEmail: true,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
      band: {
        create: {
          name: 'twice',
          members: ['MOMO', 'DAHYUN', 'MINA', 'TZUYU', 'NAYEON'],
        },
      },
      artistInformation: {
        create: {
          coverImage: twiceCover,
        },
      },
    },
  });

  let kdaAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.kda.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.kda.avatar);
    kdaAvatar = storedAvatar;
  }

  let kdaCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.kda.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.kda.cover);
    kdaCover = storedCover;
  }

  const kda = await prisma.artist.upsert({
    where: { email: 'kda@gmail.com' },
    update: {},
    create: {
      email: 'kda@gmail.com',
      password: await hash('password', 10),
      country: 'CN',
      labels: ['Riot Games'],
      genres: ['Pop'],
      yearsActive: 2,
      avatar: kdaAvatar,
      verifiedEmail: true,
      artistMetrics: {
        create: {
          followers: 0,
        },
      },
      band: {
        create: {
          name: 'kda',
          members: ['Ahri', 'Evelynn', 'Seraphine', 'Kaisa'],
        },
      },
      artistInformation: {
        create: {
          coverImage: kdaCover,
        },
      },
    },
  });

  let iNeverDieCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.iNeverDie}`)) {
    const storedAvatar = store('album', SEED_DATA.album.iNeverDie);
    iNeverDieCover = storedAvatar;
  }

  const iNeverDie = await prisma.album.upsert({
    where: { id: 1 },
    update: {},
    create: {
      cover: iNeverDieCover,
      name: 'i-never-die',
      releaseType: 'ALBUM',
      artistId: gidle.id,
      year: dayjs('2022').toDate(),
    },
  });

  let iTrustCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.iTrust}`)) {
    const storedAvatar = store('album', SEED_DATA.album.iTrust);
    iTrustCover = storedAvatar;
  }

  const iTrust = await prisma.album.upsert({
    where: { id: 2 },
    update: {},
    create: {
      cover: iTrustCover,
      name: 'i-trust',
      releaseType: 'ALBUM',
      artistId: gidle.id,
      year: dayjs('2020').toDate(),
    },
  });

  let allOutCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.allOut}`)) {
    const storedAvatar = store('album', SEED_DATA.album.allOut);
    allOutCover = storedAvatar;
  }

  const allOut = await prisma.album.upsert({
    where: { id: 3 },
    update: {},
    create: {
      cover: allOutCover,
      name: 'all-out',
      releaseType: 'ALBUM',
      artistId: gidle.id,
      year: dayjs('2020').toDate(),
    },
  });

  let kawakiWoAmekuCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.kawakiWoAmeku}`)) {
    const storedAvatar = store('album', SEED_DATA.album.kawakiWoAmeku);
    kawakiWoAmekuCover = storedAvatar;
  }

  const kawakiWoAmeku = await prisma.album.upsert({
    where: { id: 4 },
    update: {},
    create: {
      cover: kawakiWoAmekuCover,
      name: 'kawaki-wo-ameku',
      releaseType: 'SINGLE',
      artistId: pvris.id,
      year: dayjs('2018').toDate(),
    },
  });

  let speedOfLightCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.speedOfLight}`)) {
    const storedAvatar = store('album', SEED_DATA.album.speedOfLight);
    speedOfLightCover = storedAvatar;
  }

  const speedOfLight = await prisma.album.upsert({
    where: { id: 5 },
    update: {},
    create: {
      cover: speedOfLightCover,
      name: 'speed-of-light',
      releaseType: 'SINGLE',
      artistId: monsterSiren.id,
      year: dayjs('2019').toDate(),
    },
  });

  let humanCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.human}`)) {
    const storedAvatar = store('album', SEED_DATA.album.human);
    humanCover = storedAvatar;
  }

  const human = await prisma.album.upsert({
    where: { id: 6 },
    update: {},
    create: {
      cover: humanCover,
      name: 'human',
      releaseType: 'SINGLE',
      artistId: iverson.id,
      year: dayjs('2020').toDate(),
    },
  });

  let villainDiesSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.villainDies}`)) {
    const storedAvatar = store('song', SEED_DATA.song.villainDies);
    villainDiesSong = storedAvatar;
  }

  const villainDies = await prisma.song.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Villain Dies',
      path: villainDiesSong,
      albumId: iNeverDie.id,
      artistId: gidle.id,
      isExplicit: false,
    },
  });

  let ohMyGodSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.ohMyGod}`)) {
    const storedAvatar = store('song', SEED_DATA.song.ohMyGod);
    ohMyGodSong = storedAvatar;
  }

  const ohMyGod = await prisma.song.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Oh My God',
      path: ohMyGodSong,
      albumId: iTrust.id,
      artistId: gidle.id,
      isExplicit: true,
    },
  });

  let moreSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.more}`)) {
    const storedAvatar = store('song', SEED_DATA.song.more);
    moreSong = storedAvatar;
  }

  const more = await prisma.song.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'MORE',
      path: moreSong,
      albumId: allOut.id,
      artistId: gidle.id,
      collaborators: ['kda'],
      isExplicit: false,
    },
  });

  let kawakiWoAmekuSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.kawakiWoAmeku}`)) {
    const storedAvatar = store('song', SEED_DATA.song.kawakiWoAmeku);
    kawakiWoAmekuSong = storedAvatar;
  }

  const kawakiWoAmekuEntry = await prisma.song.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Kawaki Wo Ameku',
      path: kawakiWoAmekuSong,
      albumId: kawakiWoAmeku.id,
      artistId: pvris.id,
      isExplicit: true,
    },
  });

  let speedOfLightSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.speedOfLight}`)) {
    const storedAvatar = store('song', SEED_DATA.song.speedOfLight);
    speedOfLightSong = storedAvatar;
  }

  const speedOfLightEntry = await prisma.song.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Speed of Light',
      path: speedOfLightSong,
      albumId: speedOfLight.id,
      artistId: monsterSiren.id,
      collaborators: ['Okawari'],
      isExplicit: false,
    },
  });

  let humanSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.human}`)) {
    const storedAvatar = store('song', SEED_DATA.song.human);
    humanSong = storedAvatar;
  }

  const humanEntry = await prisma.song.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'Human',
      path: humanSong,
      albumId: human.id,
      artistId: iverson.id,
      isExplicit: true,
    },
  });

  return 0;
};

const store = (path, seedFile) => {
  const filename = objectHash(seedFile);
  const extension = extname(seedFile);
  const file = `${filename}${extension}`;

  readFile(`./assets/seed/${seedFile}`, (err, data) => {
    if (err) {
      console.log('Error reading file', err);
    }
    writeFile(`./assets/${path}/${file}`, data, (err) => {
      if (err) {
        console.log('Error storing file', err);
      }
    });
  });

  return file;
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
