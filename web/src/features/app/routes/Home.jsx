import { Box, Heading, SimpleGrid, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { SongCard, ArtistCard, FeaturedArtistInformation, PerfectForYou } from '../components';
import {
  FEATURED_ARTIST,
  GRADIENTS,
  SECTION_MARGIN,
  SUB_SECTION_MARGIN,
  GRID_COLUMN_HEIGHT,
  SUGGESTED_ARTISTS,
  PERFECT_FOR_YOU,
  TRENDING,
} from '../constants';

import { Footer } from '@/components/Core';
import { Banner } from '@/components/Elements';
import { Highlight } from '@/components/Utils';

export function Home() {
  return (
    <>
      <Banner image="static-featured-artist-gidle.webp">
        <SimpleGrid
          gridAutoFlow="column"
          alignItems="end"
          justifyItems="start"
          height="100%"
          padding="20px"
          columns={2}
          bg={GRADIENTS.bottom}
        >
          <FeaturedArtistInformation
            name={FEATURED_ARTIST.name}
            amountOfFollowers={FEATURED_ARTIST.amountOfFollowers}
            description={FEATURED_ARTIST.description}
          />

          <Box height={GRID_COLUMN_HEIGHT}>
            <Flex>
              {FEATURED_ARTIST.songs.map((song, index) => (
                <SongCard
                  key={index}
                  cover={song.cover}
                  name={song.name}
                  isExplicit={song.isExplicit}
                  type={song.type}
                  authors={song.authors}
                  year={song.year}
                />
              ))}
            </Flex>
          </Box>
        </SimpleGrid>
      </Banner>

      <Box margin="0 20px">
        <Heading>
          <Highlight>Artistas</Highlight> Sugeridos
        </Heading>
        <Text color="whiteAlpha.800" margin="10px 0">
          Artistas populares, nuevos o en tendencia que puede te gusten.
        </Text>
      </Box>

      <SimpleGrid column={4} gridAutoFlow="column" justifyItems="center">
        {SUGGESTED_ARTISTS.map((artist, index) => (
          <ArtistCard
            key={index}
            name={artist.name}
            avatar={artist.image}
            amountOfFollowers={artist.amountOfFollowers}
            isHighlighted={index % 2 === 0}
            to={artist.to}
          />
        ))}
      </SimpleGrid>

      <Box margin={SECTION_MARGIN}>
        <Heading>
          Perfecto para <Highlight>ti</Highlight>
        </Heading>
        <Text color="whiteAlpha.800" marginTop="10px">
          Es uno de los artistas más populares en la plataforma últimamente, probablemente se adapte
          a tu estilo también {';)'}
        </Text>

        {PERFECT_FOR_YOU.map((artist, index) => (
          <PerfectForYou
            key={index}
            name={artist.name}
            description={artist.description}
            genres={artist.genres}
            monthlyListeners={artist.monthlyListeners}
            followers={artist.followers}
            image={artist.image}
            pageURL={artist.pageURL}
            youtubeChannelURL={artist.youtubeChannelURL}
          />
        ))}
      </Box>

      <Box margin={SECTION_MARGIN}>
        <Heading>
          <Highlight>Tendencias</Highlight>
        </Heading>
        <Text color="whiteAlpha.800" marginTop="10px">
          Artistas, canciones o playlists más escuchadas en las últimas 48 horas.
        </Text>
      </Box>

      <SimpleGrid column={5}>
        <Flex margin={SUB_SECTION_MARGIN} justify="space-evenly" align="center">
          {TRENDING.map((item, index) =>
            item.cardType === 'song' ? (
              <SongCard
                key={index}
                cover={item.cover}
                name={item.name}
                isExplicit={item.isExplicit}
                type={item.type}
                authors={item.authors}
                year={item.year}
              />
            ) : (
              <ArtistCard
                key={index}
                name={item.name}
                avatar={item.image}
                amountOfFollowers={item.amountOfFollowers}
                to={item.to}
                size="sm"
              />
            )
          )}
        </Flex>
      </SimpleGrid>

      <Footer topMargin={SUB_SECTION_MARGIN} />
    </>
  );
}
