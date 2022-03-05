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
        <Text margin={['20px 20px', '20px 0']} fontSize={['xl', 'lg']}>
          Podr&aacute;s empezar tu trabajo en <Highlight>Ongaku</Highlight> una vez que confirmemos
          tu registro. Mientras, aqu&iacute; hay unas reglas que deben conocer.
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
    title: 'Puedes asociar a un manager',
    content: `Envía a ongaku.official@gmail.com la información del manager (cuenta) junto con la tuya para que la reunión sea exitosa.
      `,
    icon: MdOutlineContactMail,
  },
  {
    title: 'Robo de propiedad intelectual',
    content: `Si se detecta, u otro usuario reporta que lo publicado es robado y/o fraude; la cuenta será desactivada sin previo aviso.`,
    icon: MdOutlineSecurity,
  },
  {
    title: 'No bloqueamos contenido explícito',
    content: `Si tu trabajo incluye álbumes, canciones o singles de carácter explícito; se manejará y expondrá a la audiencia adecuada.`,
    icon: MdOutlineExplicit,
  },
  {
    title: 'Puedes disfrutar de la plataforma',
    content: `Tu cuenta es la de un artista, pero eso no evita que puedas usar Ongaku y todas sus características como si fueses un usuario normal. `,
    icon: FiMusic,
  },
];
