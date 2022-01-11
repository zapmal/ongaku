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

import { Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

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
    <>
      <SimpleGrid
        columns={2}
        margin="20px"
        maxHeight="500px"
        border={`.5px solid ${theme.colors.primaryLine.value}`}
        borderRadius="10px"
      >
        <Box margin="20px">
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

          <Text marginTop="20px" fontSize="xl" color="whiteAlpha.800">
            {description}
          </Text>

          <Text marginTop="20px" fontSize="xl" color="whiteAlpha.800">
            <Highlight>Genres:</Highlight> {genres}
          </Text>

          <Text marginTop="20px" fontSize="xl" color="whiteAlpha.800">
            <Highlight>Monthly Listeners:</Highlight> {monthlyListeners}
          </Text>

          <Text marginTop="20px" fontSize="xl" color="whiteAlpha.800">
            <Highlight>Followers:</Highlight> {followers}
          </Text>

          <Box marginTop="40px" textAlign="center">
            <Flex justify="center">
              <Button margin="20px 0 0 10px" width="250px" as={RouterLink} to={pageURL}>
                Go to Artist Page
              </Button>
              <Button margin="20px 0 0 10px" width="250px" variant="accent">
                Start Listening
              </Button>
            </Flex>
          </Box>
        </Box>
        <Image
          src={image}
          height="500px"
          borderTopRightRadius="inherit"
          borderBottomRightRadius="inherit"
          onClick={(e) => {
            if (name === 'DEMONDICE') {
              const moriImage = `${window.origin}/assets/images/static-artist-mori.jpg`;
              const demondiceImage = `${window.origin}/assets/images/static-artist-og-mori.jpeg`;

              e.target.src = moriImage;

              setTimeout(() => (e.target.src = demondiceImage), 3000);
            }
          }}
        />
      </SimpleGrid>
    </>
  );
}
