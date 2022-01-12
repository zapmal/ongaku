import {
  Box,
  Heading,
  SimpleGrid,
  Flex,
  Text,
  Image,
  Divider,
  Spacer,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { IoMdHeartEmpty, IoMdDownload } from 'react-icons/io';
import {
  MdPlayArrow,
  MdRepeat,
  MdShuffle,
  MdVolumeUp,
  MdSkipPrevious,
  MdSkipNext,
  MdForward30,
  MdReplay30,
} from 'react-icons/md';

import {
  NavigationBar,
  SongCard,
  PlaylistCard,
  ArtistCard,
  FeaturedArtistBanner,
  FeaturedArtistInformation,
  PerfectForYou,
} from '../components';
import {
  FEATURED_ARTIST,
  RECENTLY_PLAYED,
  GRADIENTS,
  SECTION_MARGIN,
  SUB_SECTION_MARGIN,
  GRID_COLUMN_HEIGHT,
  SUGGESTED_ARTISTS,
  PERFECT_FOR_YOU,
  TRENDING,
} from '../constants';

import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

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

      <Heading margin="20px">
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

      <Box margin={SECTION_MARGIN}>
        <Heading>
          <Highlight>Suggested</Highlight> Artists
        </Heading>
        <Text color="whiteAlpha.800" marginTop="10px">
          Based on your recent activity, we suggest a couple of artists that may fit your style.
        </Text>
      </Box>

      <SimpleGrid column={4} gridAutoFlow="column" justifyItems="center">
        {SUGGESTED_ARTISTS.map((artist, index) => (
          <ArtistCard
            key={index}
            name={artist.name}
            image={artist.image}
            amountOfFollowers={artist.amountOfFollowers}
            isHighlighted={index % 2 === 0}
          />
        ))}
      </SimpleGrid>

      <Box margin={SECTION_MARGIN}>
        <Heading>
          Perfect for <Highlight>you</Highlight>
        </Heading>
        <Text color="whiteAlpha.800" marginTop="10px">
          We base this one on your most listened artists and genres, you will probably love them{' '}
          {';)'}
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
          <Highlight>Trending</Highlight>
        </Heading>
        <Text color="whiteAlpha.800" marginTop="10px">
          Most listened artists, songs or playlists on the past 48 hours.
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
                image={item.image}
                amountOfFollowers={item.amountOfFollowers}
                size="sm"
              />
            )
          )}
        </Flex>
      </SimpleGrid>

      <Image
        src="/assets/images/home-footer.png"
        width="500px"
        margin={`${SUB_SECTION_MARGIN} auto`}
      />

      <Box sx={{ position: 'sticky', bottom: 0 }} zIndex={1} height="100px" overflow="hidden">
        <Flex
          align="center"
          bg={theme.colors.primaryBase.value}
          borderTop={`.5px solid ${theme.colors.primaryLine.value}`}
        >
          <Flex width="300px">
            <Image src="/assets/images/static-current-song-perfect-world.jpeg" width="100px" />
            <Flex flexFlow="column" justify="center" marginLeft="20px">
              <Highlight>Perfect World</Highlight>
              <Text fontSize="sm" color="whiteAlpha.800">
                From <Highlight variant="gray">TWICE</Highlight>
              </Text>
              <Text fontSize="sm" color="whiteAlpha.800">
                Album: <Highlight>Perfect World</Highlight>
              </Text>
            </Flex>

            <Spacer />

            <Divider orientation="vertical" h="60px" marginTop="20px" />
          </Flex>

          <SimpleGrid width="700px">
            <Flex justify="space-evenly">
              <IconButton variant="ghost" icon={<Icon as={MdRepeat} w="25px" h="25px" />} />
              <IconButton variant="ghost" icon={<Icon as={MdShuffle} w="25px" h="25px" />} />
              <IconButton variant="ghost" icon={<Icon as={MdVolumeUp} w="25px" h="25px" />} />
              <IconButton variant="ghost" icon={<Icon as={IoMdHeartEmpty} w="25px" h="25px" />} />
              <IconButton variant="ghost" icon={<Icon as={IoMdDownload} w="25px" h="25px" />} />
            </Flex>

            <Flex align="center" height="35px">
              <Spacer />

              <Text marginRight="10px" fontSize="sm">
                0:00
              </Text>
              <Divider width="500px" borderBlockStartWidth="1.5px" />
              <Text marginLeft="10px" fontSize="sm">
                3:40
              </Text>

              <Spacer />

              <Divider orientation="vertical" h="60px" marginBottom="40px" />
            </Flex>
          </SimpleGrid>

          <Box margin="0 auto">
            <IconButton variant="ghost" icon={<Icon as={MdSkipPrevious} w="35px" h="35px" />} />
            <IconButton
              variant="ghost"
              icon={<Icon as={MdReplay30} w="35px" h="35px" />}
              marginRight="10px"
            />
            <IconButton
              bg="whiteAlpha.900"
              borderRadius="50%"
              icon={
                <Icon as={MdPlayArrow} w="35px" h="35px" color={theme.colors.primaryBase.value} />
              }
            />
            <IconButton
              variant="ghost"
              icon={<Icon as={MdForward30} w="35px" h="35px" />}
              marginLeft="10px"
            />
            <IconButton variant="ghost" icon={<Icon as={MdSkipNext} w="35px" h="35px" />} />
          </Box>
        </Flex>
      </Box>
    </>
  );
}
