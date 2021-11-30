import {
  SimpleGrid,
  Image,
  Center,
  Avatar,
  Wrap,
  WrapItem,
  Box,
  Text,
  Heading,
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { NavigationBar } from '../styles';

import { Button, Highlight, Card } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function ChooseUserType() {
  return (
    <SimpleGrid backgroundImage="/assets/svgs/random-lines.svg">
      <NavigationBar>
        <Image src="/assets/images/logo-transparent.png" alt="Ongaku Logo" />

        <Box margin="30px 30px 0 0">
          <Button
            label={<Highlight variant="gray">Already have an account?</Highlight>}
            align="center"
            padding="20px 30px"
            as={Link}
            to={'/login'}
          >
            Login
          </Button>
        </Box>
      </NavigationBar>

      <Box textAlign="center">
        <Heading fontSize={['2xl', '3xl', '4xl', '5xl']} marginTop="20px">
          We&apos;re ready to let you in
        </Heading>
        <Text paddingTop="15px" fontSize="xl">
          But first, <Highlight>what are you?</Highlight>
        </Text>
      </Box>

      <Center>
        <Wrap>
          <WrapItem padding={['60px 80px', '60px 21%', '60px 25%', '60px 25%', '60px 80px']}>
            <Center>
              <Link to="/register/artist">
                <Card>
                  <Avatar
                    size="xl"
                    name="Laura Chouette"
                    src="/assets/images/laura-chouette-artist.png"
                  />
                  <Text fontSize="2xl" color={theme.colors.accentSolid.value}>
                    Artist
                  </Text>
                  <Text color={theme.colors.primaryText.value}>
                    You want to publish and manage your songs.
                  </Text>
                </Card>
              </Link>
            </Center>
          </WrapItem>
          <WrapItem padding={['60px 80px', '60px 21%', '60px 25%', '60px 25%', '60px 80px']}>
            <Center>
              <Link to="/register/user">
                <Card>
                  <Avatar
                    size="xl"
                    name="Laura Chouette"
                    src="/assets/images/laura-chouette-user.png"
                  />
                  <Text fontSize="2xl" color={theme.colors.accentSolid.value}>
                    User
                  </Text>
                  <Text color={theme.colors.primaryText.value}>
                    You want to use the application normally.
                  </Text>
                </Card>
              </Link>
            </Center>
          </WrapItem>
        </Wrap>
      </Center>

      <Center marginTop="50px" marginBottom="20px">
        <Text color={theme.colors.primaryText.value}>
          This decision cannot be changed later on.
        </Text>
      </Center>
    </SimpleGrid>
  );
}
