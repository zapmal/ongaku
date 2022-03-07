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
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Login } from '../components/Login';
import { NavigationBar } from '../styles';

import { Button, Card } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

export function ChooseUserType() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <SimpleGrid backgroundImage="/assets/svgs/random-lines.svg" height="100vh">
      <NavigationBar>
        <Link to="/">
          <Image src="/assets/images/app-icon-transparent.png" alt="Ongaku Logo" />
        </Link>

        <Box margin="20px 30px 0 0">
          <Button
            label={<Highlight variant="gray">¿Ya tienes una cuenta?</Highlight>}
            align="center"
            padding="20px 30px"
            onClick={onOpen}
          >
            Inicia Sesión
          </Button>
        </Box>
      </NavigationBar>

      <Box textAlign="center">
        <Heading fontSize={['2xl', '3xl', '4xl', '5xl']}>
          Estamos listos para darte la bienvenida
        </Heading>
        <Text paddingTop="15px" fontSize="2xl">
          Pero primero, <Highlight>¿qué eres?</Highlight>
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
                    Artista
                  </Text>
                  <Text color={theme.colors.primaryText.value}>
                    Quieres publicar y manejar tu trabajo en Ongaku.
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
                    Usuario
                  </Text>
                  <Text color={theme.colors.primaryText.value}>
                    Quieres usar la aplicación de manera normal
                  </Text>
                </Card>
              </Link>
            </Center>
          </WrapItem>
        </Wrap>
      </Center>

      <VStack textAlign="center" marginBottom="20px" color={theme.colors.primaryText.value}>
        <Text width="40%" marginBottom="5px">
          Esta decisión no puede ser cambiada en el futuro.{' '}
        </Text>
      </VStack>

      {isOpen && <Login isOpen={isOpen} onClose={onClose} />}
    </SimpleGrid>
  );
}
