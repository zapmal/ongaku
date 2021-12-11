import { Text, Center } from '@chakra-ui/react';
import React from 'react';

import { theme } from '@/stitches.config.js';

export function Footer({ paddingTop = '0' }) {
  return (
    <div>
      <Center textAlign="center" paddingTop={paddingTop} paddingBottom="10px">
        <Text color={theme.colors.primaryText.value} maxW={['300px', '450px', '500px', '600px']}>
          By using our application you agree to the usage of cookies, which are needed to make the
          application work correctly. We also store your IP address and registration date for
          security purposes.
        </Text>
      </Center>
      <Center paddingBottom={['30px', '10px']}>
        <Text fontWeight="bold">All rights belong to their respective owners.</Text>
      </Center>
    </div>
  );
}
