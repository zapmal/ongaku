import {
  Heading,
  Text,
  SimpleGrid,
  Box,
  IconButton,
  Link,
  Icon,
  Image,
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import { FaYoutube } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

import { SUB_SECTION_MARGIN } from '../../constants';

import { Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

const TEXT_PROPS = { marginTop: '20px', fontSize: 'xl', color: 'whiteAlpha.800' };
const BUTTON_PROPS = { margin: '20px 0 0 10px', width: '250px' };

export function PerfectForYou({
  name,
  image,
  description,
  genres,
  monthlyListeners,
  followers,
  pageURL,
  youtubeChannelURL,
}) {
  return (
    <SimpleGrid
      columns={2}
      margin={SUB_SECTION_MARGIN}
      maxHeight="500px"
      border={`.5px solid ${theme.colors.primaryLine.value}`}
      borderRadius="10px"
    >
      <Box margin={SUB_SECTION_MARGIN}>
        <Heading fontSize="xxx-large" color={theme.colors.accentText.value}>
          {name}{' '}
          <IconButton
            variant="ghost"
            href={youtubeChannelURL}
            isDisabled={!youtubeChannelURL}
            as={Link}
            isExternal
            icon={<Icon as={FaYoutube} w="35px" h="35px" />}
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
          />
        </Heading>

        <Text {...TEXT_PROPS}>{description}</Text>

        <Text {...TEXT_PROPS}>
          <Highlight>Géneros:</Highlight> {genres}
        </Text>

        <Text {...TEXT_PROPS}>
          <Highlight>Audiencia Mensual:</Highlight> {monthlyListeners}
        </Text>

        <Text {...TEXT_PROPS}>
          <Highlight>Seguidores:</Highlight> {followers}
        </Text>

        <Box marginTop="40px" textAlign="center">
          <Flex justify="center">
            <Button {...BUTTON_PROPS} as={RouterLink} to={pageURL}>
              Ir a Página
            </Button>
            <Button {...BUTTON_PROPS} variant="accent">
              Empezar a Escuchar
            </Button>
          </Flex>
        </Box>
      </Box>
      <Image
        src={image}
        height="500px"
        borderTopRightRadius="inherit"
        borderBottomRightRadius="inherit"
        onClick={(event) => {
          if (name === 'DEMONDICE') {
            const moriImage = `${window.origin}/assets/images/static-artist-mori.jpg`;
            const demondiceImage = `${window.origin}/assets/images/static-artist-og-mori.jpeg`;

            event.target.src = moriImage;

            setTimeout(() => (event.target.src = demondiceImage), 3000);
          }
        }}
      />
    </SimpleGrid>
  );
}
