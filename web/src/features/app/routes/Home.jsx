import { Box, Heading, SimpleGrid, Flex } from '@chakra-ui/react';
import React from 'react';

import {
  NavigationBar,
  SongCard,
  PlaylistCard,
  FeaturedArtistBanner,
  FeaturedArtistInformation,
} from '../components';
import { FEATURED_ARTIST, GRADIENTS, GRID_COLUMN_HEIGHT } from '../constants';

export function Home() {
  return (
    <>
      <FeaturedArtistBanner image="static-featured-artist-gidle.webp">
        <NavigationBar />

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

      <Heading margin="10px">Recently Played</Heading>
      <SimpleGrid column={6}>
        <Flex margin="20px">
          <SongCard
            name="XD"
            isExplicit={true}
            type="song"
            cover="/assets/images/static-oh-my-god.jpg"
            authors="Yung Iverson"
            year={2019}
          />

          <PlaylistCard
            name="Example"
            likes={36}
            amountOfSongs={150}
            cover="/assets/images/static-oh-my-god.jpg"
            author="Yung Iverson"
          />
        </Flex>
      </SimpleGrid>
    </>
  );
}
