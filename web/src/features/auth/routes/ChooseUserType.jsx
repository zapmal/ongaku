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
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { NavigationBar } from '../styles';
import { Login } from '../';

import { Button, Highlight, Card } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function ChooseUserType() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <SimpleGrid backgroundImage="/assets/svgs/random-lines.svg" height="100vh">
      <NavigationBar>
        <Link to="/">
            <Image src="/assets/images/app-icon-transparent.png" alt="Ongaku Logo"/>
          </Link>

        <Box margin="20px 20px 0 0">
          <Button
            label={<Highlight variant="gray">Already have an account?</Highlight>}
            align="center"
            padding="20px 30px"
            onClick={onOpen}
          >
            Login
          </Button>
        </Box>
      </NavigationBar>

      <Box textAlign="center">
        <Heading fontSize={['2xl', '3xl', '4xl', '5xl']}>We&apos;re ready to let you in</Heading>
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

      <Center>
        <Text color={theme.colors.primaryText.value}>
          This decision cannot be changed later on.
        </Text>
      </Center>
      <Login isOpen={isOpen} onClose={onClose} />
    </SimpleGrid>
  );
}
