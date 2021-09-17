import {
  Box,
  ButtonGroup,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Divider,
  Center,
} from '@chakra-ui/react';
import React from 'react';
import { MdAlbum, MdPersonAdd } from 'react-icons/md';

import { Background, ArtistImage, NavigationBar } from '../styles';

import { Button, Highlight, BulletPoint } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

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

export function Landing() {
  return (
    <Background>
      <SimpleGrid columns={2}>
        <ArtistImage
          src="/assets/images/landing.webp"
          alt="Korean group TWICE photoshoot for Perfect World song"
        />

        <div>
          <NavigationBar>
            <Image src="/assets/images/logo-transparent.png" alt="Ongaku Logo" />
            <ButtonGroup spacing="6">
              <Button label={<Highlight tone="accent">Existing user?</Highlight>}>Login</Button>
              <Button label={<Highlight tone="accent">New user?</Highlight>}>Register</Button>

              <Center>
                <Divider orientation="vertical" borderColor="white.Alpha.500" height="40px" />
              </Center>

              <Button label={<Highlight>Lost account?</Highlight>} variant="accent">
                Recover it
              </Button>
            </ButtonGroup>
          </NavigationBar>

          <Box textAlign="center">
            <Heading paddingTop="3" size="2xl">
              Ongaku - <Highlight tone="accent">Music at {"it's"} best</Highlight>
            </Heading>
            <Text padding="5" fontSize="md" lineHeight="2">
              <Highlight tone="accent">Ongaku</Highlight> is a music streaming platform inspired by
              the likes of <Highlight tone="accent">iTunes, Spotify and YouTube Music</Highlight>{' '}
              that is focused on delivering a comfortable and blazing-fast streaming experience to
              the <Highlight tone="accent">user</Highlight> regardless of their zone, so that they
              can listen their favorite artists even on poor or unstable connections.
            </Text>
          </Box>

          {bulletPoints.map((bulletPoint, index) => (
            <BulletPoint
              key={index}
              Icon={bulletPoint.icon}
              title={bulletPoint.title}
              content={bulletPoint.content}
              extraStyles={{ marginBottom: 30, paddingLeft: 30 }}
            />
          ))}
          <Text
            textAlign="center"
            color={theme.colors.primaryTextContrast.value}
            paddingTop="2"
            fontSize="sm"
          >
            All rights belong to their respective owners, this project was made for learning
            purposes.
          </Text>
        </div>
      </SimpleGrid>
    </Background>
  );
}
