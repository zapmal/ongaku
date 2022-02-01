import {
  Box,
  IconButton,
  Button,
  Divider,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Flex,
  Image,
  Text,
  Icon,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import { FiTwitter, FiInstagram } from 'react-icons/fi';
import { MdAdd, MdShare, MdVerifiedUser } from 'react-icons/md';

import { Footer } from '@/components/Core';
import { Banner } from '@/components/Elements';
import {
  SongRow,
  SongCard,
  ArtistRow,
  TRANSPARENT_ICON_PROPS,
  NEW_ALBUMS_AND_SINGLES,
  GRADIENTS,
  NEW_ARTISTS,
  NEW_SONGS,
} from '@/features/app';
import { theme } from '@/stitches.config.js';

const HIGHLIGHT_PROPS = {
  fontSize: 'lg',
  fontWeight: 'bold',
  color: theme.colors.accentText.value,
};
const TEXT_PROPS = {
  color: 'whiteAlpha.700',
  fontWeight: 'normal',
  fontSize: 'lg',
};
const BUTTON_PROPS = {
  variant: 'outline',
  borderRadius: '5px',
  _hover: { bg: theme.colors.accentSolidHover.value },
  _active: { bg: theme.colors.accentSolidActive.value },
};

export function ArtistProfile() {
  return (
    <Box>
      <Banner image="static-artist-banner.jpeg" height="700px">
        <Flex align="center" justify="center" height="100%" bg={GRADIENTS.bottom}>
          <VStack marginTop="150px">
            <Heading fontSize="xxx-large" letterSpacing="4px">
              Arknights
            </Heading>
            <HStack fontWeight="bold" fontSize="lg">
              <Icon as={MdVerifiedUser} color="cyan.300" w="25px" h="25px" />
              <Text>Verified Artist</Text>
            </HStack>
            <Text fontWeight="bold" fontSize="lg" color="whiteAlpha.800">
              3,001,828 monthly listeners
            </Text>
            <HStack>
              <IconButton
                {...TRANSPARENT_ICON_PROPS}
                as={Link}
                isExternal
                href="https://twitter.com/Arknights_EN"
                icon={<Icon as={FiTwitter} w="25px" h="25px" />}
              />
              <IconButton
                {...TRANSPARENT_ICON_PROPS}
                as={Link}
                isExternal
                href="https://instagram.com/arknights_messenger"
                icon={<Icon as={FiInstagram} w="25px" h="25px" />}
              />
            </HStack>
            <HStack>
              <Button {...BUTTON_PROPS} rightIcon={<Icon as={MdAdd} w="20px" h="20px" />}>
                Follow
              </Button>
              <Button {...BUTTON_PROPS} rightIcon={<Icon as={MdShare} w="20px" h="20px" />}>
                Share
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </Banner>

      <SimpleGrid columns={2} align="center">
        <Box>
          <Heading fontSize="xx-large">Top Songs</Heading>
          {NEW_SONGS.map((song, index) => (
            <Box key={index}>
              <SongRow
                name={song.name}
                cover={song.cover}
                isExplicit={song.isExplicit}
                authors={song.authors}
                streams="1,333,334"
                albumName={song.albumName}
                year={song.year}
                duration={song.duration}
                width="90%"
              />
              <Divider width="90%" />
            </Box>
          ))}
        </Box>
        <Box>
          <Heading fontSize="xx-large">Fans also like</Heading>
          {NEW_ARTISTS.map((artist, index) => (
            <Box key={index}>
              <ArtistRow
                name={artist.name}
                image={artist.image}
                amountOfFollowers={artist.amountOfFollowers}
                to={artist.to}
                badge={false}
                size="sm"
              />
              <Divider width="75%" />
            </Box>
          ))}
        </Box>
      </SimpleGrid>

      <Box margin="60px 0">
        <Heading fontSize="xx-large" textAlign="center">
          New albums & singles
        </Heading>
        <Flex justify="center">
          {NEW_ALBUMS_AND_SINGLES.map((song, index) => (
            <Box margin="30px 0" key={index}>
              <SongCard
                cover={song.cover}
                name={song.name}
                isExplicit={song.isExplicit}
                type={song.type}
                authors={song.authors}
                year={song.year}
              />
            </Box>
          ))}
        </Flex>
      </Box>

      <SimpleGrid columns={2} align="center" margin="20px">
        <Image
          src="/assets/images/static-artist-about-banner.jpg"
          height="500px"
          borderRadius="10px"
        />
        <Box textAlign="left" margin="0 30px" color="whiteAlpha.700">
          <Heading fontSize="xx-large" color={theme.colors.accentText.value} margin="10px 0">
            About Arknights
          </Heading>
          <Text>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae non asperiores fugit
            quaerat dicta reiciendis neque aliquam sit temporibus, numquam culpa modi error quo cum
            voluptas nobis rem repellat! Quibusdam fugit veritatis quisquam, nulla repellat
            accusamus dolore sequi natus labore aliquam neque alias, fugiat temporibus tempora
            suscipit qui numquam ea corrupti explicabo, non doloremque animi ipsa iure
            necessitatibus! Quia nulla ab aliquam vel aspernatur, explicabo, vitae assumenda saepe
            sunt asperiores illum nostrum laboriosam, earum consequatur? Quis excepturi maiores
            architecto mollitia hic ratione voluptatibus, nihil quam, possimus doloribus non modi ea
            esse odio dolore. Recusandae eos unde sunt minima quaerat quam.
          </Text>

          <HStack marginTop="20px">
            <Text {...HIGHLIGHT_PROPS}>Genres: </Text>
            <Text {...TEXT_PROPS}>Electropop, synth-pop-alternative, rock, post-hardcore</Text>
          </HStack>

          <HStack marginTop="5px">
            <Text {...HIGHLIGHT_PROPS}>Followers: </Text>
            <Text {...TEXT_PROPS}>6,000,311 </Text>
          </HStack>
        </Box>
      </SimpleGrid>

      <Footer topMargin="40px" />
    </Box>
  );
}
