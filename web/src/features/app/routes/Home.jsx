import { Box, Heading, SimpleGrid, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import {
  NavigationBar,
  SongCard,
  PlaylistCard,
  FeaturedArtistBanner,
  FeaturedArtistInformation,
  ArtistIcon,
  PerfectForYou,
} from '../components';
import {
  FEATURED_ARTIST,
  RECENTLY_PLAYED,
  GRADIENTS,
  GRID_COLUMN_HEIGHT,
  SUGGESTED_ARTISTS,
  PERFECT_FOR_YOU,
} from '../constants';

import { Highlight } from '@/components/Utils';

export function Home() {
  return (
    <>
      <NavigationBar />
      <FeaturedArtistBanner image="static-featured-artist-gidle.webp">
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
      </FeaturedArtistBanner>

      <Heading margin="30px">
        Recently <Highlight>Played</Highlight>
      </Heading>

      <SimpleGrid column={6}>
        <Flex margin="20px">
          {RECENTLY_PLAYED.map((item, index) =>
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
              <PlaylistCard
                key={index}
                cover={item.cover}
                name={item.name}
                likes={item.likes}
                amountOfSongs={item.amountOfSongs}
                author={item.author}
              />
            )
          )}
        </Flex>
      </SimpleGrid>

      <Box margin="30px">
        <Heading>
          <Highlight>Suggested</Highlight> Artists
        </Heading>
        <Text color="whiteAlpha.800" marginTop="10px">
          Based on your recent activity, we suggest a couple of artists that may fit your style.
        </Text>
      </Box>

      <SimpleGrid column={4} gridAutoFlow="column" justifyItems="center">
        {SUGGESTED_ARTISTS.map((artist, index) => (
          <ArtistIcon
            key={index}
            name={artist.name}
            image={artist.image}
            amountOfFollowers={artist.amountOfFollowers}
            isHighlighted={index % 2 === 0}
          />
        ))}
      </SimpleGrid>

      <Box margin="30px">
        <Heading>
          Perfect for <Highlight>you</Highlight>
        </Heading>
        <Text color="whiteAlpha.800" marginTop="10px">
          We base this one on your most listened artists, you will probably love them too.
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
    </>
  );
}
