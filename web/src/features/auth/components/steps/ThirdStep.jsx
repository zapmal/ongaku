import { Box, Heading, Text, Divider } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Elements';

export function ThirdStep() {
  return (
    <div>
      <Box textAlign="left">
        <Heading size="lg" paddingTop="10px">
          ¡Registro Finalizado!
        </Heading>
        <Text padding="20px">
          Debes de revisar la bandeja principal de tu correo, te enviamos un link para la
          verificación de tu cuenta. ¡Una vez verificada podrás usar Ongaku!
        </Text>
        <Button marginLeft="20px" as={Link} to={'/welcome?type=artist'}>
          Ir a Ongaku
        </Button>
      </Box>
      <Divider padding="10px" width="90%" />
    </div>
  );
}
