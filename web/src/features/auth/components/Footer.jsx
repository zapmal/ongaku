import { Text, Center } from '@chakra-ui/react';
import React from 'react';

import { theme } from '@/stitches.config.js';

export function Footer({ paddingTop = '0' }) {
  return (
    <div>
      <Center textAlign="center" paddingTop={paddingTop} paddingBottom="10px">
        <Text color={theme.colors.primaryText.value} maxW={['300px', '450px', '500px', '600px']}>
          Al registrarte en Ongaku estás de acuerdo con el uso de cookies, las cuáles son
          fundamentales para el funcionamiento de la misma. Además, almacenamos tu dirección IP,
          fecha de registro y ubicación por seguridad.
        </Text>
      </Center>
      <Center paddingBottom={['30px', '10px']}>
        <Text fontWeight="bold">Todos los derechos le pertenecen a sus respectivos autores.</Text>
      </Center>
    </div>
  );
}
