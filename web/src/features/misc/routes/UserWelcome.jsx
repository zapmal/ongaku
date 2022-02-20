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
          Bienvenido, <Highlight>usuario</Highlight>
        </Heading>
        <Text padding="15px" fontSize={['md', 'lg']} lineHeight={2}>
          ¿Quieres una recomendación? Revisa nuestro conjunto de{' '}
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
          Skip
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
          Go to artist page
        </Button>
        <Button
          size="sm"
          variant="outline"
          as={RouterLink}
          to={artist.page}
          _hover={{
            borderColor: artist.solidColor,
            color: artist.solidColor,
          }}
          _active={{
            color: artist.activeColor,
            borderColor: artist.activeColor,
          }}
        >
          Follow
        </Button>
      </ButtonGroup>
    </ArtistCard>
  ));
}

const ArtistCard = styled('div', {
  borderRadius: '20px',
  paddingBottom: '$4',
  maxWidth: '350px',
  maxHeight: '400px',
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
    biography: `George Miller, better known by his stage name Joji 
    and formerly by his online alias Filthy Frank, is a Japanese singer 
    and songwriter.
    `,
    solidColor: 'cyan.600',
    hoverColor: 'cyan.700',
    activeColor: 'cyan.500',
    page: '/artists/joji',
  },
  {
    name: 'BTS',
    biography: `BTS, also known as the Bangtan Boys, is a seven-member 
    South Korean boy band that was formed in 2010 and debuted in 2013 
    under Big Hit Entertainment.
    `,
    solidColor: 'yellow.600',
    hoverColor: 'yellow.700',
    activeColor: 'yellow.500',
    page: '/artists/bts',
  },
  {
    name: 'KDA',
    biography: `K/DA is a virtual K-pop–inspired girl group consisting 
    of four themed versions of League of Legends characters: Ahri, Akali,
    Evelynn and Kai'Sa. 
    `,
    solidColor: 'purple.600',
    hoverColor: 'purple.700',
    activeColor: 'purple.500',
    page: '/artists/kda',
  },
];
