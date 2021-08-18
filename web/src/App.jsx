import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

import { styled } from '../stitches.config';

const Button = styled('button', {
  margin: '$3',
  padding: '$4',
  color: 'white',
  variants: {
    type: {
      success: {
        backgroundColor: '$successSolid',
      },
      danger: {
        backgroundColor: '$dangerSolid',
      },
      warning: {
        backgroundColor: '$warningSolid',
      },
      base: {
        backgroundColor: '$primaryBg',
      },
      accent: {
        backgroundColor: '$accentSolid',
      },
      info: {
        backgroundColor: '$infoSolid',
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider>
      <Button type="success">Success</Button>
      <Button type="danger">Danger</Button>
      <Button type="warning">Warning</Button>
      <Button type="base">Base</Button>
      <Button type="accent">Accent</Button>
      <Button type="info">Info</Button>
    </ChakraProvider>
  );
}

export default App;
