import { Box, Heading, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { MdHome } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import { Button, Highlight } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function NotFound() {
  const history = useHistory();

  const handleRedirect = () => {
    history.push('/');
  };

  return (
    <Box align="center" paddingTop="10">
      <Heading size="xl">
        Got <Highlight>lost?</Highlight>
      </Heading>

      <Text
        textAlign="center"
        color={theme.colors.primaryTextContrast.value}
        padding="5"
        fontSize="lg"
        width="50%"
      >
        The page you tried to access {"doesn't"} exist. It maybe got{' '}
        <Highlight>deleted or renamed</Highlight>, go home and try again.
      </Text>

      <Image src="/assets/svgs/undraw-moving.svg" width="400px" margin="5" />

      <Button
        onClick={handleRedirect}
        variant="accent"
        extraProps={{ margin: '20px', rightIcon: <MdHome /> }}
      >
        Home
      </Button>
    </Box>
  );
}
