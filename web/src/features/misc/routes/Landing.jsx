import { ButtonGroup, SimpleGrid } from '@chakra-ui/react';
import React from 'react';

import { Background, ArtistImage, NavigationBar } from '../styles';

import { Button } from '@/components/Elements';

export function Landing() {
  return (
    <Background>
      <SimpleGrid columns={2}>
        <ArtistImage
          src="/assets/images/landing.webp"
          alt="Korean group TWICE photoshoot for Perfect World song"
        />
        <NavigationBar>
          <ButtonGroup spacing="6">
            <Button label="Existing user?">Login</Button>
            <Button label="New user?">Register</Button>
          </ButtonGroup>
        </NavigationBar>
      </SimpleGrid>
    </Background>
  );
}
