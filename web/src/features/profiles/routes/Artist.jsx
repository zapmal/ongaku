import {
  Box,
  Button as ChakraButton,
  Divider,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Flex,
  Text,
  Icon,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { MdAdd, MdShare, MdEdit } from 'react-icons/md';

import { EditArtistProfile } from '../components';

import { Footer } from '@/components/Core';
import { Banner, Button } from '@/components/Elements';
import {
  SongRow,
  SongCard,
  ArtistRow,
  NEW_ALBUMS_AND_SINGLES,
  GRADIENTS,
  NEW_ARTISTS,
  NEW_SONGS,
} from '@/features/app';
import { theme } from '@/stitches.config.js';
import { copyURL } from '@/utils/copyURL';

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box>
        <Banner image="/assets/images/static-artist-banner.jpeg" height="700px">
          <Flex align="center" justify="center" height="100%" bg={GRADIENTS.bottom}>
            <VStack marginTop="150px">
              <Heading fontSize="xxx-large" letterSpacing="4px">
                Arknights
              </Heading>
              <Text fontWeight="bold" fontSize="lg">
                Seguidores: 3,001,828
              </Text>
              <HStack fontWeight="bold" fontSize="lg">
                <Link isExternal href="https://arknights.official.com">
                  SITIO WEB OFICIAL
                </Link>
                <Icon as={FiExternalLink} w="20px" h="20px" />
              </HStack>
              <HStack>
                <ChakraButton {...BUTTON_PROPS} rightIcon={<Icon as={MdAdd} w="25px" h="25px" />}>
                  Seguir
                </ChakraButton>
                <ChakraButton
                  // onClick={() => copyURL(`artist/${artist.artisticName}`)}
                  onClick={() => copyURL(`artist/`)}
                  {...BUTTON_PROPS}
                  rightIcon={<Icon as={MdShare} w="20px" h="20px" />}
                >
                  Compartir
                </ChakraButton>
                {/* isArtist or isManager */}
                {true && (
                  <Button variant="accent" rightIcon={<Icon as={MdEdit} />} onClick={onOpen}>
                    Editar Perfil
                  </Button>
                )}
              </HStack>
            </VStack>
          </Flex>
        </Banner>

        <SimpleGrid columns={2} align="center">
          <Box>
            <Heading fontSize="xx-large">Canciones Populares</Heading>
            {NEW_SONGS.map((song, index) => (
              <Box key={index}>
                <SongRow
                  name={song.name}
                  cover={song.cover}
                  isExplicit={song.isExplicit}
                  authors={song.authors}
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
            <Heading fontSize="xx-large">A los fans también les gusta</Heading>
            {NEW_ARTISTS.map((artist, index) => (
              <Box key={index}>
                <ArtistRow
                  name={artist.name}
                  avatar={artist.image}
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
            Nuevos Albumes, Singles y EPs
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

        <Box align="center" margin="0 30px" color="whiteAlpha.700">
          <Heading fontSize="xx-large" color={theme.colors.accentText.value} margin="10px 0">
            Acerca de Arknights
          </Heading>
          <Text width="80%">
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

          <Box marginTop="20px">
            <Text {...HIGHLIGHT_PROPS}>Géneros: </Text>
            <Text {...TEXT_PROPS}>Electropop, synth-pop-alternative, rock, post-hardcore</Text>
          </Box>
        </Box>

        <Footer topMargin="40px" />
      </Box>
      {isOpen && <EditArtistProfile isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
