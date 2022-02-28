import { Text, VStack, Spinner, Icon } from '@chakra-ui/react';
import React from 'react';
import { VscError } from 'react-icons/vsc';

import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

const POSITION_STYLES = {
  position: 'absolute',
  top: '200px',
  left: '0',
  right: '0',
};

export function Status({ status, message }) {
  return status === 'loading' ? (
    <VStack {...POSITION_STYLES} color={theme.colors.accentSolid.value}>
      <Spinner size="xl" />
      {message && <Text color="whiteAlpha.700">{message}</Text>}
    </VStack>
  ) : (
    <VStack {...POSITION_STYLES} color="whiteAlpha.800" textAlign="center">
      <Icon as={VscError} h="60px" w="60px" color={theme.colors.accentSolid.value} />
      <Highlight>
        ¡Oh no!
        <br />
      </Highlight>
      <Text>Ha ocurrido un error.</Text>
      <Text width="80%">{message}</Text>
    </VStack>
  );
}
