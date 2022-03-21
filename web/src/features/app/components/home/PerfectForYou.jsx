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
import { copyURL } from '@/utils/copyURL';

const TEXT_PROPS = { marginTop: '20px', fontSize: 'xl', color: 'whiteAlpha.800' };
const BUTTON_PROPS = { margin: '20px 0 0 10px', width: '250px' };

export function PerfectForYou({
  name,
  image,
  description,
  genres,
  followers,
  country,
  labels,
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
          {name.toUpperCase()} {getFlagEmoji(country)}{' '}
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
          <Highlight>Géneros:</Highlight>{' '}
          {genres.map((genre, index) => {
            return genres.length !== index + 1 ? `${genre}, ` : genre;
          })}
        </Text>

        <Text {...TEXT_PROPS}>
          <Highlight>Discográfica(s):</Highlight>{' '}
          {labels.map((label, index) => {
            return labels.length !== index + 1 ? `${label}, ` : label;
          })}
        </Text>

        <Text {...TEXT_PROPS}>
          <Highlight>Seguidores:</Highlight> {followers}
        </Text>

        <Box marginTop="40px" textAlign="center">
          <Flex justify="center">
            <Button {...BUTTON_PROPS} as={RouterLink} to={pageURL}>
              Ir a Página
            </Button>
            <Button {...BUTTON_PROPS} variant="accent" onClick={() => copyURL(`artist/${name}`)}>
              Compartir
            </Button>
          </Flex>
        </Box>
      </Box>
      <Image
        src={image}
        height="500px"
        objectFit="cover"
        borderTopRightRadius="inherit"
        borderBottomRightRadius="inherit"
        onClick={(event) => {
          if (name === 'demondice') {
            const moriImage = `${window.origin}/assets/images/static-artist-mori.jpg`;
            const demondiceImage = image;

            event.target.src = moriImage;

            setTimeout(() => (event.target.src = demondiceImage), 100);
          }
        }}
      />
    </SimpleGrid>
  );
}

const getFlagEmoji = (countryCode = 'VE') => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());

  return String.fromCodePoint(...codePoints);
};
