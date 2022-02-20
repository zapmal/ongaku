import { Box, Heading, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { MdHome } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

export function NotFound() {
  const navigate = useNavigate();

  const handleRedirect = () => navigate('/');

  return (
    <Box align="center" paddingTop={['40px', '20px']}>
      <Heading size="xl">
        ¿Te has <Highlight>pérdido?</Highlight>
      </Heading>

      <Text
        textAlign="center"
        color={theme.colors.primaryTextContrast.value}
        padding="15px"
        fontSize="lg"
        width={['70%', '50%']}
      >
        La página solicitada no ha sido encontrada. Si no tienes las cookies activadas o si estás
        usando modo incógnito, intenta habilitarlas o deshabilitar el incógnito e intenta de nuevo.
        Si ninguna de estas opciones funciona, entonces la página fue eliminada o no tienes permisos
        para verla.
        <br />
        <br />
        Si crees que esto es un error, contáctanos: <Highlight>official.ongaku@gmail.com</Highlight>
      </Text>

      <Button
        onClick={handleRedirect}
        variant="accent"
        margin="20px"
        size="lg"
        rightIcon={<MdHome size={25} />}
      >
        Inicio
      </Button>

      <Image src="/assets/svgs/undraw-moving.svg" width={['300px', '400px']} margin="5px" />
    </Box>
  );
}
