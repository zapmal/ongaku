import { Image, ButtonGroup, Divider, Center, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { MdHome } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { Login } from '@/features/auth';
import { styled } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';

const Container = styled('header', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',

  '& div': {
    paddingTop: '$3',
    verticalAlign: 'center',
  },

  '& div:last-child': {
    paddingRight: '$3',
  },

  '& img': {
    width: '150px',
    display: 'inline',
  },

  '@sm': {
    justifyContent: 'center',
    '& div:last-child': {
      paddingRight: '0',
    },
    '& img': {
      display: 'none',
    },
  },

  variants: {
    isLoggedIn: {
      true: {
        alignItems: 'center',
        height: '80px',
        marginTop: '$3',
        marginBottom: '$5',
      },
    },
  },
});

export function NavigationBar() {
  const [isLoggedIn, logout] = useAuthStore((s) => [s.isLoggedIn, s.logout]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = async () => {
    logout();
    window.location.assign('/');
  };

  return (
    <Container isLoggedIn={isLoggedIn()}>
      <Image src="/assets/images/logo-transparent.png" alt="Ongaku Logo" />
      <ButtonGroup spacing={[3, 4]}>
        {isLoggedIn() ? (
          <>
            <Button size="lg" rightIcon={<MdHome size={20} />} as={Link} to="/home">
              Inicio
            </Button>

            <Center>
              <Divider orientation="vertical" borderColor="white.Alpha.500" height="40px" />
            </Center>

            <Button
              onClick={handleLogout}
              variant="accent"
              size="lg"
              rightIcon={<FiLogOut size={20} />}
            >
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <>
            <Button
              label={<Highlight>¿Ya tienes cuenta?</Highlight>}
              align="center"
              isFullWidth={true}
              onClick={onOpen}
            >
              Inicio de Sesión
            </Button>
            <Button
              label={<Highlight>¿Nuevo usuario?</Highlight>}
              as={Link}
              to="/register"
              align="center"
            >
              Registro
            </Button>

            <Center>
              <Divider orientation="vertical" borderColor="white.Alpha.500" height="40px" />
            </Center>

            <Button
              label={<Highlight variant="primary">¿Perdiste tu cuenta?</Highlight>}
              as={Link}
              to="/account-recovery"
              variant="accent"
              align="center"
            >
              Recúperar Cuenta
            </Button>
          </>
        )}
      </ButtonGroup>
      {isOpen && <Login isOpen={isOpen} onClose={onClose} />}
    </Container>
  );
}
