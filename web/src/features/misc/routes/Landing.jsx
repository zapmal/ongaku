import { Box, Heading, SimpleGrid, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { MdAlbum, MdPersonAdd } from 'react-icons/md';

import { Header } from '../components';

import { BulletPoint } from '@/components/BulletPoint';
import { Highlight } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function Landing() {
  return (
    <SimpleGrid columns={[1, 2]}>
      <Image
        src="/assets/images/landing.webp"
        alt="Korean group TWICE photoshoot for Perfect World song"
        height="100vh"
        display={['none', 'inline']}
        fallbackSrc="https://via.placeholder.com/1080"
      />
      <div>
        <Header page="landing" />

        <Box textAlign="center">
          <Heading paddingTop="20px" fontSize={['2xl', '4xl']}>
            Ongaku - <Highlight>Music at {"it's"} best</Highlight>
          </Heading>
          <Text padding="20px" fontSize={['sm', 'md']} lineHeight={2}>
            <Highlight>Ongaku</Highlight> is a music streaming platform inspired by the likes of{' '}
            <Highlight>iTunes, Spotify and YouTube Music</Highlight> that is focused on delivering a
            comfortable and blazing-fast streaming experience to the <Highlight>user</Highlight>{' '}
            regardless of their zone, so that they can listen their favorite artists even on poor or
            unstable connections.
          </Text>
        </Box>

        <BulletList />

        <Text
          textAlign="center"
          color={theme.colors.primaryTextContrast.value}
          padding={['10px 30px 0 30px', '10px 0 0 0']}
          fontSize="sm"
        >
          All rights belong to their respective owners, this project was made for learning purposes.
        </Text>
      </div>
    </SimpleGrid>
  );
}

const bulletPoints = [
  {
    title: 'Listen to whatever you want, even with friends',
    content: `You can create playlists and listen to your favorite artists. On top of that, 
    you also can listen music with your friends!
    `,
    icon: MdPersonAdd,
  },
  {
    title: 'Perfect for artists',
    content: `Regardless of your experience on the field, we will provide you the best 
    tools available at hand.`,
    icon: MdAlbum,
  },
];

function BulletList() {
  return bulletPoints.map((bulletPoint, index) => (
    <BulletPoint
      key={index}
      Icon={bulletPoint.icon}
      title={bulletPoint.title}
      content={bulletPoint.content}
      marginBottom="30px"
      paddingLeft="30px"
    />
  ));
}
