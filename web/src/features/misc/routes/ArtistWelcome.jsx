import { Box, Heading, Text, Center, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { FiMusic } from 'react-icons/fi';
import { MdOutlineContactMail, MdOutlineSecurity, MdOutlineExplicit } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { NavigationBar } from '../components/NavBar';

import { Button } from '@/components/Elements';
import { BulletPoint, Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

export function ArtistWelcome() {
  return (
    <Box alignItems="center">
      <Box paddingLeft={['30px', 0]}>
        <NavigationBar />
      </Box>
      <Box textAlign="center" paddingLeft={['30px', 0]}>
        <Heading paddingTop={['30px', 0]} fontSize={['3xl', '4xl']}>
          Bienvenido
        </Heading>
        <Text margin="20px auto" fontSize={['xl', 'lg']} width="80%">
          Aquí tienes información que te será vital en los primeros momentos de uso de la
          aplicación, lee con cuidado y accede a <Highlight>Ongaku</Highlight> haciendo click en el
          botón de Entendido al terminar.
        </Text>
      </Box>

      <BulletList />

      <Center marginTop="40px" flexDirection="column" paddingLeft={['30px', 0]}>
        <Button variant="accent" as={Link} to="/home" padding="30px" fontSize="xl">
          Entendido
        </Button>
        <Text
          fontSize="sm"
          color={theme.colors.primaryText.value}
          marginTop="10px"
          marginBottom={['20px', 0]}
        >
          Los derechos le pertenecen a sus respectivos autores.
        </Text>
      </Center>
    </Box>
  );
}

function BulletList() {
  return (
    <SimpleGrid columns={2} marginLeft="80px" marginTop="40px" spacing="20px">
      {bulletPoints.map((bulletPoint, index) => (
        <Center w="600px" key={index}>
          <BulletPoint
            key={index}
            Icon={bulletPoint.icon}
            title={bulletPoint.title}
            content={bulletPoint.content}
          />
        </Center>
      ))}
    </SimpleGrid>
  );
}

const bulletPoints = [
  {
    title: 'Respecto a las publicaciones',
    content: `Estas son manejadas en el módulo administrativo que es accesible a través de tu icono en la esquina superior izquierda, es visible una vez salgas de esta página.`,
    icon: MdOutlineSecurity,
  },
  {
    title: 'Más información sobre ti',
    content: `Puedes ir a tu perfil y agregar información extra como un avatar, una portada, biografía y sitio web oficial.`,
    icon: MdOutlineContactMail,
  },
  {
    title: 'Está permitido el contenido explicito',
    content: `Permitimos la publicación de ese tipo de trabajos a pesar de que no son para todo el público.`,
    icon: MdOutlineExplicit,
  },
  {
    title: 'Puedes disfrutar usar la plataforma',
    content: `Pero tu cuenta al ser la de un artista, está limitada en características, lo que significa que tienes acceso parcial a la plataforma.`,
    icon: FiMusic,
  },
];
