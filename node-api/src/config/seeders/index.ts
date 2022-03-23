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
      cover: 's_iverson_cover.webp',
    },
    bts: {
      avatar: 's_bts.webp',
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
      cover: 's_demondice_cover.jpeg',
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
    redVelvet: {
      avatar: 's_red_velvet.jpg',
      cover: 's_red_velvet_cover.jpg',
    },
    sulli: {
      avatar: 's_sulli.webp',
      cover: 's_sulli_cover.jpg',
    },
    jonghyun: {
      avatar: 's_jonghyun.jpg',
      cover: 's_jonghyun_cover.webp',
    },
    olivia: {
      avatar: 's_olivia.webp',
      cover: 's_olivia_cover.jpg',
    },
    iu: {
      avatar: 's_iu.jpg',
      cover: 's_iu_cover.jpg',
    },
  },
  album: {
    iNeverDie: 's_i_never_die.jpg', // VILLAIN DIES, ALBUM
    iTrust: 's_i_trust.jpg', // Oh My God, ALBUM
    allOut: 's_all_out.jpg', // MORE, ALBUM (kda collab)
    kawakiWoAmeku: 's_kawaki_wo_ameku.jpg', // SAME NAME, SINGLE
    speedOfLight: 's_speed_of_light.png', // SAME NAME, SINGLE
    human: 's_human.jpg', // Human, ALBUM
    theReveFestival2022: 's_the_reve_festival_2022.jpg', // Album
    goblin: 's_goblin.webp', // Album - 2019
    storyOp2: 's_story_op_2.jpg', // Album - 2017
    sour: 's_sour.jpg', // Album - 2021
    shutupAndGetHappy: 's_shutup_and_get_happy.jpeg', // Album - 2022
    contingencyContract: 's_contingency_contract.jpg', // Album - 2022
    manifesto: 's_manifesto.jpg', // EP - 2021
    radiant: 's_radiant.jpg', // EP - 2021
    unalive: 's_unalive.jpeg', // Album - 2022
    palette: 's_palette.jpg',
    redLofi: 's_red_lofi.png', // Single - 2022
    iBurn: 's_i_burn.webp',
  },
  song: {
    moon: 's_moon.mp3',
    villainDies: 's_villain_dies.mp3',
    ohMyGod: 's_oh_my_god.mp3',
    more: 's_more.mp3',
    kawakiWoAmeku: 's_kawaki_wo_ameku.mp3',
    speedOfLight: 's_speed_of_light.mp3',
    human: 's_human.mp3',
    lonely: 's_lonely.mp3', // collab with taeyeon
    radiant: 's_radiant.mp3',
    dawnseeker: 's_dawnseeker.mp3',
    pineSoot: 's_pine_soot.mp3',
    wildScales: 's_wild_scales.mp3',
    leadSeal: 's_lead_seal.mp3',
    operationBlade: 's_operation_blade.mp3',
    burnMeToTheGround: 's_burn_me_to_the_ground.mp3',
    redLofi: 's_red_lofi.mp3',
    unalive: 's_unalive.mp3',
    scuffedUpAge: 's_scuffed_up_age.mp3',
    deadOnArrival: 's_dead_on_arrival.mp3',
    wantingGettingWanting: 's_wanting_getting_wanting.mp3',
    takeTheBait: 's_take_the_bait.mp3',
    darkHour: 's_dark_hour.mp3',
    manifesto: 's_manifesto.mp3',
    traitor: 's_traitor.mp3',
    throughTheNight: 's_through_the_night.mp3',
    onTheMoon: 's_on_the_moon.mp3',
    tomboy: 's_tomboy.mp3',
    already: 's_already.mp3',
    inMyDreams: 's_in_my_dreams.mp3',
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

  let iversonCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.iverson.cover}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.iverson.cover);
    iversonCover = storedAvatar;
  }

  // Artist, verified email.
  const iverson = await prisma.artist.upsert({
    where: { email: 'yungiverson@gmail.com' },
    update: {},
    create: {
      email: 'yungiverson@gmail.com',
      country: 'VE',
      artisticName: 'iverson',
      genres: ['Rap', 'Raro'],
      yearsActive: 4,
      labels: ['Arrecho Records'],
      verifiedEmail: true,
      password: await hash('password', 10),
      avatar: iversonAvatar,
      artistInformation: {
        create: {
          coverImage: iversonCover,
        },
      },
      artistMetrics: {
        create: {
          followers: 1021,
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
          followers: 8591,
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
      genres: ['Pop', 'Rap'],
      yearsActive: 2,
      verifiedEmail: true,
      avatar: btsAvatar,
      artistMetrics: {
        create: {
          followers: 10200,
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
          followers: 25084,
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
          followers: 12043,
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
          followers: 6102,
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
          followers: 8028,
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
          followers: 18012,
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
          followers: 2311,
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
          followers: 14012,
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
          followers: 9912,
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

  let redVelvetAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.redVelvet.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.redVelvet.avatar);
    redVelvetAvatar = storedAvatar;
  }

  let redVelvetCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.redVelvet.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.redVelvet.cover);
    redVelvetCover = storedCover;
  }

  const redVelvet = await prisma.artist.upsert({
    where: { email: 'redvelvet@gmail.com' },
    update: {},
    create: {
      email: 'redvelvet@gmail.com',
      password: await hash('password', 10),
      country: 'KR',
      labels: ['PepeGa Records'],
      genres: ['Pop', 'Funk'],
      yearsActive: 6,
      avatar: redVelvetAvatar,
      verifiedEmail: true,
      artistMetrics: {
        create: {
          followers: 9000,
        },
      },
      band: {
        create: {
          name: 'red-velvet',
          members: ['Irene', 'Joy', 'Yeri', 'Seulgi', 'Wendy'],
        },
      },
      artistInformation: {
        create: {
          coverImage: redVelvetCover,
        },
      },
    },
  });

  let sulliAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.sulli.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.sulli.avatar);
    sulliAvatar = storedAvatar;
  }

  let sulliCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.sulli.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.sulli.cover);
    sulliCover = storedCover;
  }

  const sulli = await prisma.artist.upsert({
    where: { email: 'sulli@gmail.com' },
    update: {},
    create: {
      email: 'sulli@gmail.com',
      password: await hash('password', 10),
      country: 'KR',
      labels: ['SM Entertainment'],
      genres: ['Pop', 'Rock'],
      yearsActive: 4,
      avatar: sulliAvatar,
      verifiedEmail: true,
      artisticName: 'sulli',
      artistMetrics: {
        create: {
          followers: 10000,
        },
      },
      artistInformation: {
        create: {
          coverImage: sulliCover,
        },
      },
    },
  });

  let jonghyunAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.jonghyun.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.jonghyun.avatar);
    jonghyunAvatar = storedAvatar;
  }

  let jonghyunCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.jonghyun.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.jonghyun.cover);
    jonghyunCover = storedCover;
  }

  const jonghyun = await prisma.artist.upsert({
    where: { email: 'jonghyun@gmail.com' },
    update: {},
    create: {
      email: 'jonghyun@gmail.com',
      password: await hash('password', 10),
      country: 'KR',
      labels: ['SM Entertainment'],
      genres: ['Pop', 'Rap'],
      yearsActive: 3,
      avatar: jonghyunAvatar,
      verifiedEmail: true,
      artisticName: 'jonghyun',
      artistMetrics: {
        create: {
          followers: 9013,
        },
      },
      artistInformation: {
        create: {
          coverImage: jonghyunCover,
        },
      },
    },
  });

  let oliviaAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.olivia.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.olivia.avatar);
    oliviaAvatar = storedAvatar;
  }

  let oliviaCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.olivia.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.olivia.cover);
    oliviaCover = storedCover;
  }

  const olivia = await prisma.artist.upsert({
    where: { email: 'olivia@gmail.com' },
    update: {},
    create: {
      email: 'olivia@gmail.com',
      password: await hash('password', 10),
      country: 'US',
      labels: ['Billboard'],
      genres: ['Pop'],
      yearsActive: 2,
      avatar: oliviaAvatar,
      verifiedEmail: true,
      artisticName: 'olivia-rodrigo',
      artistMetrics: {
        create: {
          followers: 5851,
        },
      },
      artistInformation: {
        create: {
          coverImage: oliviaCover,
        },
      },
    },
  });

  let iuAvatar = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.iu.avatar}`)) {
    const storedAvatar = store('artist', SEED_DATA.images.iu.avatar);
    iuAvatar = storedAvatar;
  }

  let iuCover = null;
  if (!existsSync(`./assets/artist/${SEED_DATA.images.iu.cover}`)) {
    const storedCover = store('artist', SEED_DATA.images.iu.cover);
    iuCover = storedCover;
  }

  const iu = await prisma.artist.upsert({
    where: { email: 'iucontact@gmail.com' },
    update: {},
    create: {
      email: 'iucontact@gmail.com',
      password: await hash('password', 10),
      country: 'KR',
      labels: ['Kakao Entertainment', 'Universal Music Japan'],
      genres: ['Electronic', 'Ballads', 'Pop'],
      yearsActive: 2,
      avatar: iuAvatar,
      verifiedEmail: true,
      artisticName: 'iu',
      artistMetrics: {
        create: {
          followers: 8930,
        },
      },
      artistInformation: {
        create: {
          coverImage: iuCover,
        },
      },
    },
  });

  // ALBUMS
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
      name: 'i-will-never-die',
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
      artistId: kda.id,
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

  let theReveFestival2022Cover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.theReveFestival2022}`)) {
    const storedCover = store('album', SEED_DATA.album.theReveFestival2022);
    theReveFestival2022Cover = storedCover;
  }

  const theReveFestival2022 = await prisma.album.upsert({
    where: { id: 7 },
    update: {},
    create: {
      cover: theReveFestival2022Cover,
      name: 'the-reve-festival-2022',
      releaseType: 'ALBUM',
      artistId: redVelvet.id,
      year: dayjs('2022').toDate(),
    },
  });

  let goblinCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.goblin}`)) {
    const storedCover = store('album', SEED_DATA.album.goblin);
    goblinCover = storedCover;
  }

  const goblin = await prisma.album.upsert({
    where: { id: 8 },
    update: {},
    create: {
      cover: goblinCover,
      name: 'goblin',
      releaseType: 'ALBUM',
      artistId: sulli.id,
      year: dayjs('2019').toDate(),
    },
  });

  let storyOp2Cover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.storyOp2}`)) {
    const storedCover = store('album', SEED_DATA.album.storyOp2);
    storyOp2Cover = storedCover;
  }

  const storyOp2 = await prisma.album.upsert({
    where: { id: 9 },
    update: {},
    create: {
      cover: storyOp2Cover,
      name: 'story-op-2',
      releaseType: 'ALBUM',
      artistId: jonghyun.id,
      year: dayjs('2017').toDate(),
    },
  });

  let sourCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.sour}`)) {
    const storedCover = store('album', SEED_DATA.album.sour);
    sourCover = storedCover;
  }

  const sour = await prisma.album.upsert({
    where: { id: 10 },
    update: {},
    create: {
      cover: sourCover,
      name: 'sour',
      releaseType: 'ALBUM',
      artistId: olivia.id,
      year: dayjs('2021').toDate(),
    },
  });

  let shutupAndGetHappyCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.shutupAndGetHappy}`)) {
    const storedCover = store('album', SEED_DATA.album.shutupAndGetHappy);
    shutupAndGetHappyCover = storedCover;
  }

  const shutupAndGetHappy = await prisma.album.upsert({
    where: { id: 11 },
    update: {},
    create: {
      cover: shutupAndGetHappyCover,
      name: 'shutup-and-get-happy',
      releaseType: 'ALBUM',
      artistId: demondice.id,
      year: dayjs('2022').toDate(),
    },
  });

  let contingencyContractCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.contingencyContract}`)) {
    const storedCover = store('album', SEED_DATA.album.contingencyContract);
    contingencyContractCover = storedCover;
  }

  const contingencyContract = await prisma.album.upsert({
    where: { id: 12 },
    update: {},
    create: {
      cover: contingencyContractCover,
      name: 'contingency-contract',
      releaseType: 'ALBUM',
      artistId: monsterSiren.id,
      year: dayjs('2022').toDate(),
    },
  });

  let manifestoCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.manifesto}`)) {
    const storedCover = store('album', SEED_DATA.album.manifesto);
    manifestoCover = storedCover;
  }

  const manifesto = await prisma.album.upsert({
    where: { id: 13 },
    update: {},
    create: {
      cover: manifestoCover,
      name: 'manifesto',
      releaseType: 'EP',
      artistId: monsterSiren.id,
      year: dayjs('2021').toDate(),
    },
  });

  let radiantCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.radiant}`)) {
    const storedCover = store('album', SEED_DATA.album.radiant);
    radiantCover = storedCover;
  }

  const radiant = await prisma.album.upsert({
    where: { id: 14 },
    update: {},
    create: {
      cover: radiantCover,
      name: 'radiant',
      releaseType: 'EP',
      artistId: monsterSiren.id,
      year: dayjs('2021').toDate(),
    },
  });

  let unaliveCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.unalive}`)) {
    const storedCover = store('album', SEED_DATA.album.unalive);
    unaliveCover = storedCover;
  }

  const unalive = await prisma.album.upsert({
    where: { id: 15 },
    update: {},
    create: {
      cover: unaliveCover,
      name: 'unalive',
      releaseType: 'ALBUM',
      artistId: mori.id,
      year: dayjs('2022').toDate(),
    },
  });

  let redLofiCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.redLofi}`)) {
    const storedCover = store('album', SEED_DATA.album.redLofi);
    redLofiCover = storedCover;
  }

  const redLofi = await prisma.album.upsert({
    where: { id: 16 },
    update: {},
    create: {
      cover: redLofiCover,
      name: 'red-lofi-ver',
      releaseType: 'SINGLE',
      artistId: mori.id,
      year: dayjs('2022').toDate(),
    },
  });

  let paletteCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.palette}`)) {
    const storedCover = store('album', SEED_DATA.album.palette);
    paletteCover = storedCover;
  }

  const palette = await prisma.album.upsert({
    where: { id: 17 },
    update: {},
    create: {
      cover: paletteCover,
      name: 'Palette',
      releaseType: 'SINGLE',
      artistId: iu.id,
      year: dayjs('2017').toDate(),
    },
  });

  let iBurnCover = null;
  if (!existsSync(`./assets/album/${SEED_DATA.album.iBurn}`)) {
    const storedCover = store('album', SEED_DATA.album.iBurn);
    iBurnCover = storedCover;
  }

  const iBurn = await prisma.album.upsert({
    where: { id: 18 },
    update: {},
    create: {
      cover: iBurnCover,
      name: 'I Burn',
      releaseType: 'ALBUM',
      artistId: gidle.id,
      year: dayjs('2021').toDate(),
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
      name: 'VILLAIN DIES',
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
      artistId: kda.id,
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
      collaborators: ['okawari'],
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

  let lonelySong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.lonely}`)) {
    const storedAvatar = store('song', SEED_DATA.song.lonely);
    lonelySong = storedAvatar;
  }

  const lonely = await prisma.song.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: 'Lonely',
      collaborators: ['taeyeon'],
      path: lonelySong,
      albumId: storyOp2.id,
      artistId: jonghyun.id,
      isExplicit: true,
    },
  });

  let radiantSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.radiant}`)) {
    const storedAvatar = store('song', SEED_DATA.song.radiant);
    radiantSong = storedAvatar;
  }

  const radiantEntry = await prisma.song.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: 'Radiant',
      path: radiantSong,
      albumId: radiant.id,
      artistId: monsterSiren.id,
      isExplicit: false,
    },
  });

  let dawnseekerSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.dawnseeker}`)) {
    const storedAvatar = store('song', SEED_DATA.song.dawnseeker);
    dawnseekerSong = storedAvatar;
  }

  const dawnseeker = await prisma.song.upsert({
    where: { id: 9 },
    update: {},
    create: {
      name: 'Dawnseeker',
      path: dawnseekerSong,
      albumId: contingencyContract.id,
      artistId: monsterSiren.id,
      isExplicit: false,
    },
  });

  let pineSootSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.pineSoot}`)) {
    const storedAvatar = store('song', SEED_DATA.song.pineSoot);
    pineSootSong = storedAvatar;
  }

  const pineSoot = await prisma.song.upsert({
    where: { id: 10 },
    update: {},
    create: {
      name: 'Pine Soot',
      path: pineSootSong,
      albumId: contingencyContract.id,
      artistId: monsterSiren.id,
      isExplicit: true,
    },
  });

  let wildScalesSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.wildScales}`)) {
    const storedAvatar = store('song', SEED_DATA.song.wildScales);
    wildScalesSong = storedAvatar;
  }

  const wildScales = await prisma.song.upsert({
    where: { id: 11 },
    update: {},
    create: {
      name: 'Wild Scales',
      path: wildScalesSong,
      albumId: contingencyContract.id,
      artistId: monsterSiren.id,
      isExplicit: false,
    },
  });

  let leadSealSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.leadSeal}`)) {
    const storedAvatar = store('song', SEED_DATA.song.leadSeal);
    leadSealSong = storedAvatar;
  }

  const leadSeal = await prisma.song.upsert({
    where: { id: 12 },
    update: {},
    create: {
      name: 'Lead Seal',
      path: leadSealSong,
      albumId: contingencyContract.id,
      artistId: monsterSiren.id,
      isExplicit: false,
    },
  });

  let operationBladeSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.operationBlade}`)) {
    const storedAvatar = store('song', SEED_DATA.song.operationBlade);
    operationBladeSong = storedAvatar;
  }

  const operationBlade = await prisma.song.upsert({
    where: { id: 13 },
    update: {},
    create: {
      name: 'Operation Blade',
      path: operationBladeSong,
      albumId: contingencyContract.id,
      artistId: monsterSiren.id,
      isExplicit: false,
    },
  });

  let burnMeToTheGroundSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.burnMeToTheGround}`)) {
    const storedAvatar = store('song', SEED_DATA.song.burnMeToTheGround);
    burnMeToTheGroundSong = storedAvatar;
  }

  const burnMeToTheGround = await prisma.song.upsert({
    where: { id: 14 },
    update: {},
    create: {
      name: 'Burn me to the Ground',
      path: burnMeToTheGroundSong,
      albumId: contingencyContract.id,
      artistId: monsterSiren.id,
      isExplicit: true,
    },
  });

  let redLofiSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.redLofi}`)) {
    const storedAvatar = store('song', SEED_DATA.song.redLofi);
    redLofiSong = storedAvatar;
  }

  const redLofiEntry = await prisma.song.upsert({
    where: { id: 15 },
    update: {},
    create: {
      name: 'Red Lofi Ver',
      path: redLofiSong,
      albumId: redLofi.id,
      artistId: mori.id,
      isExplicit: false,
    },
  });

  let unaliveSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.unalive}`)) {
    const storedAvatar = store('song', SEED_DATA.song.unalive);
    unaliveSong = storedAvatar;
  }

  const unaliveEntry = await prisma.song.upsert({
    where: { id: 16 },
    update: {},
    create: {
      name: 'Unalive',
      path: unaliveSong,
      albumId: unalive.id,
      artistId: mori.id,
      isExplicit: false,
    },
  });

  let scuffedUpAgeSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.scuffedUpAge}`)) {
    const storedAvatar = store('song', SEED_DATA.song.scuffedUpAge);
    scuffedUpAgeSong = storedAvatar;
  }

  const scuffedUpAge = await prisma.song.upsert({
    where: { id: 17 },
    update: {},
    create: {
      name: 'Scuffed Up Age',
      path: scuffedUpAgeSong,
      albumId: unalive.id,
      artistId: mori.id,
      isExplicit: false,
    },
  });

  let deadOnArrivalSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.deadOnArrival}`)) {
    const storedAvatar = store('song', SEED_DATA.song.deadOnArrival);
    deadOnArrivalSong = storedAvatar;
  }

  const deadOnArrival = await prisma.song.upsert({
    where: { id: 18 },
    update: {},
    create: {
      name: 'Dead on Arrival',
      path: deadOnArrivalSong,
      albumId: unalive.id,
      artistId: mori.id,
      isExplicit: false,
    },
  });

  let wantingGettingWantingSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.wantingGettingWanting}`)) {
    const storedAvatar = store('song', SEED_DATA.song.wantingGettingWanting);
    wantingGettingWantingSong = storedAvatar;
  }

  const wantingGettingWanting = await prisma.song.upsert({
    where: { id: 19 },
    update: {},
    create: {
      name: 'Wanting Getting Wanting',
      path: wantingGettingWantingSong,
      albumId: shutupAndGetHappy.id,
      artistId: demondice.id,
      isExplicit: true,
    },
  });

  let takeTheBaitSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.takeTheBait}`)) {
    const storedAvatar = store('song', SEED_DATA.song.takeTheBait);
    takeTheBaitSong = storedAvatar;
  }

  const takeTheBait = await prisma.song.upsert({
    where: { id: 20 },
    update: {},
    create: {
      name: 'Take the Bait',
      path: takeTheBaitSong,
      albumId: shutupAndGetHappy.id,
      artistId: demondice.id,
      isExplicit: false,
    },
  });

  let darkHourSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.darkHour}`)) {
    const storedAvatar = store('song', SEED_DATA.song.darkHour);
    darkHourSong = storedAvatar;
  }

  const darkHour = await prisma.song.upsert({
    where: { id: 21 },
    update: {},
    create: {
      name: 'Dark hour',
      path: darkHourSong,
      albumId: shutupAndGetHappy.id,
      artistId: demondice.id,
      isExplicit: true,
    },
  });

  let manifestoSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.manifesto}`)) {
    const storedAvatar = store('song', SEED_DATA.song.manifesto);
    manifestoSong = storedAvatar;
  }

  const manifestoEntry = await prisma.song.upsert({
    where: { id: 22 },
    update: {},
    create: {
      name: 'Manifesto',
      path: manifestoSong,
      albumId: manifesto.id,
      artistId: monsterSiren.id,
      isExplicit: false,
    },
  });

  let traitorSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.traitor}`)) {
    const storedAvatar = store('song', SEED_DATA.song.traitor);
    traitorSong = storedAvatar;
  }

  const traitor = await prisma.song.upsert({
    where: { id: 23 },
    update: {},
    create: {
      name: 'Traitor',
      path: traitorSong,
      albumId: sour.id,
      artistId: olivia.id,
      isExplicit: false,
    },
  });

  let throughTheNightSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.throughTheNight}`)) {
    const storedAvatar = store('song', SEED_DATA.song.throughTheNight);
    throughTheNightSong = storedAvatar;
  }

  const throughTheNight = await prisma.song.upsert({
    where: { id: 24 },
    update: {},
    create: {
      name: 'Through the Night',
      path: throughTheNightSong,
      albumId: palette.id,
      artistId: iu.id,
      isExplicit: false,
    },
  });

  let onTheMoonSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.onTheMoon}`)) {
    const storedAvatar = store('song', SEED_DATA.song.onTheMoon);
    onTheMoonSong = storedAvatar;
  }

  const onTheMoon = await prisma.song.upsert({
    where: { id: 25 },
    update: {},
    create: {
      name: 'On the Moon',
      path: onTheMoonSong,
      albumId: goblin.id,
      artistId: sulli.id,
      isExplicit: false,
    },
  });

  let tomboySong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.tomboy}`)) {
    const storedAvatar = store('song', SEED_DATA.song.tomboy);
    tomboySong = storedAvatar;
  }

  const tomboy = await prisma.song.upsert({
    where: { id: 26 },
    update: {},
    create: {
      name: 'TOMBOY',
      path: tomboySong,
      albumId: iNeverDie.id,
      artistId: gidle.id,
      isExplicit: true,
    },
  });

  let alreadySong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.already}`)) {
    const storedAvatar = store('song', SEED_DATA.song.already);
    alreadySong = storedAvatar;
  }

  const already = await prisma.song.upsert({
    where: { id: 27 },
    update: {},
    create: {
      name: 'ALREADY',
      path: alreadySong,
      albumId: iNeverDie.id,
      artistId: gidle.id,
      isExplicit: false,
    },
  });

  let inMyDreamsSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.inMyDreams}`)) {
    const storedAvatar = store('song', SEED_DATA.song.inMyDreams);
    inMyDreamsSong = storedAvatar;
  }

  const inMyDreams = await prisma.song.upsert({
    where: { id: 28 },
    update: {},
    create: {
      name: 'In My Dreams',
      path: inMyDreamsSong,
      albumId: theReveFestival2022.id,
      artistId: redVelvet.id,
      isExplicit: false,
    },
  });

  let moonSong = null;
  if (!existsSync(`./assets/song/${SEED_DATA.song.moon}`)) {
    const storedAvatar = store('song', SEED_DATA.song.moon);
    moonSong = storedAvatar;
  }

  const moon = await prisma.song.upsert({
    where: { id: 29 },
    update: {},
    create: {
      name: 'MOON',
      path: moonSong,
      albumId: iBurn.id,
      artistId: gidle.id,
      isExplicit: false,
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
