import { Image, ButtonGroup, Divider, Center, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { MdHome } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { Highlight, Button } from '@/components/Elements';
import { Login } from '@/features/auth';
import { styled } from '@/stitches.config.js';

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
    isWelcome: {
      true: {
        alignItems: 'center',
        height: '80px',
      },
    },
  },
});

// Welcome as default because we use it twice.
export function NavigationBar({ page = 'welcome' }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Container isWelcome={page === 'welcome'}>
      <Image src="/assets/images/logo-transparent.png" alt="Ongaku Logo" />
      <ButtonGroup spacing={[3, 4]}>
        {page === 'landing' ? (
          <>
            <Button label={<Highlight>Existing user?</Highlight>} align="center" isFullWidth={true} onClick={onOpen}>
              Login
            </Button>
            <Button label={<Highlight>New user?</Highlight>} as={Link} to="/register" align="center" isFullWidth={true}>
              Register
            </Button>

            <Center>
              <Divider orientation="vertical" borderColor="white.Alpha.500" height="40px" />
            </Center>

            <Button
              label={<Highlight variant="primary">Lost account?</Highlight>}
              variant="accent"
              align="center"
            >
              <Link to="/account-recovery">Recover it</Link>
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" rightIcon={<MdHome size={20} />} as={Link} to="/home">
              Home
            </Button>

            <Center>
              <Divider orientation="vertical" borderColor="white.Alpha.500" height="40px" />
            </Center>

            <Button
              onClick={() => console.log('logged out!')}
              variant="accent"
              size="lg"
              rightIcon={<FiLogOut size={20} />}
            >
              Logout
            </Button>
          </>
        )}
      </ButtonGroup>
      <Login isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}
