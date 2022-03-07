import { Box, Heading, Text, ButtonGroup, Button, Image } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { NavigationBar } from '../components/NavBar';

import { Link } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme, styled } from '@/stitches.config.js';

export function UserWelcome() {
  return (
    <Box backgroundImage="/assets/svgs/lines.svg" height="100%">
      <NavigationBar />
      <Box textAlign="center">
        <Heading paddingTop={['30px', 0]} fontSize={['3xl', '4xl']}>
          Bienvenido
        </Heading>
        <Text padding="25px" fontSize={['md', 'lg']} lineHeight={2}>
          ¿Quieres un buen inicio? Revisa nuestro conjunto de{' '}
          <Highlight>artistas recomendados</Highlight>
        </Text>

        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          flexDirection={['column', 'row']}
        >
          <RecommendedArtists />
        </Box>
      </Box>

      <Box textAlign="center" padding="20px">
        <Link to="/home" variant="gray">
          Saltar
        </Link>
      </Box>
    </Box>
  );
}

function RecommendedArtists() {
  return recommendedArtists.map((artist, index) => (
    <ArtistCard key={index}>
      <Image
        fallbackSrc="https://via.placeholder.com/400x220"
        src={`/assets/images/recommendation-${artist.name.toLowerCase()}.webp`}
        alt={`Recommended Artist "${artist.name}""`}
      />
      <Heading fontSize="2xl" color={artist.solidColor} letterSpacing="3px" marginTop="5px">
        {artist.name}
      </Heading>
      <Text color={theme.colors.primaryText.value}>{artist.biography}</Text>

      <ButtonGroup>
        <Button
          size="sm"
          backgroundColor={artist.solidColor}
          as={RouterLink}
          to={artist.page}
          _hover={{
            bg: artist.hoverColor,
          }}
          _active={{
            bg: artist.activeColor,
          }}
        >
          Ir a Página
        </Button>
      </ButtonGroup>
    </ArtistCard>
  ));
}

const ArtistCard = styled('div', {
  borderRadius: '20px',
  paddingBottom: '$4',
  width: '350px',
  height: '380px',
  textAlign: 'center',
  backgroundColor: '$primaryBg',
  filter: 'drop-shadow(10px 10px 4px rgba(0, 0, 0, 0.25))',
  transition: '200ms ease-in-out',
  justifyItems: 'center',

  '&:hover': {
    backgroundColor: '$primaryBgSubtle',
  },

  '& p': {
    fontSize: '$sm',
    padding: '$2 $5',
  },

  '& img': {
    borderRadius: '20px 20px 0 0',
  },

  '@sm': {
    maxWidth: '300px',
    margin: '$2',
  },
});

const recommendedArtists = [
  {
    name: 'Joji',
    biography: `George Miller, también conocido por su pseudónimo Joji es un cantante japónes y escritor
    de canciones. Previamente conocido como Filthy Frank.`,
    solidColor: 'cyan.600',
    hoverColor: 'cyan.700',
    activeColor: 'cyan.500',
    page: '/artist/joji',
  },
  {
    name: 'BTS',
    biography: `BTS, también conocidos como los Bangtan Boys es una banda de siete miembros de origen coreano
    que fue formada en 2010 y debutó en 2013 con Big Hit Entertainment.`,
    solidColor: 'yellow.600',
    hoverColor: 'yellow.700',
    activeColor: 'yellow.500',
    page: '/artist/bts',
  },
  {
    name: 'KDA',
    biography: `K/DA es un grupo virtual inspirado por el K-Pop que consiste de cuatro personajes de League of Legends: 
    Ahri, Akali, Kai'sa y Evelynn.`,
    solidColor: 'purple.600',
    hoverColor: 'purple.700',
    activeColor: 'purple.500',
    page: '/artist/kda',
  },
];
