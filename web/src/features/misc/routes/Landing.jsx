import { Box, Heading, SimpleGrid, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { MdAlbum, MdPersonAdd } from 'react-icons/md';

import { NavigationBar } from '../components/NavBar';

import { BulletPoint, Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

export function Landing() {
  return (
    <SimpleGrid columns={[1, 2]}>
      <Image
        src="/assets/images/landing.webp"
        alt="Korean group TWICE photoshoot for Perfect World song"
        height="100vh"
        display={['none', 'inline']}
        fallbackSrc="https://via.placeholder.com/1080"
      />
      <div>
        <NavigationBar />

        <Box textAlign="center">
          <Heading paddingTop="20px" fontSize={['2xl', '4xl']}>
            Ongaku - <Highlight>Música al límite</Highlight>
          </Heading>
          <Text padding="20px" fontSize={['sm', 'md']} lineHeight={2}>
            <Highlight>Ongaku</Highlight> es una plataforma de streaming músical, inspirada por sus
            predecesores como son <Highlight>Spotify, iTunes y Youtube Music</Highlight>, estando
            enfocada principalmente en la experiencia de usuario, rendimiento y usabilidad, con el
            fin de asegurar una placentera experiencia en cualquier ocasión.
          </Text>
        </Box>

        <BulletList />

        <Text
          textAlign="center"
          color={theme.colors.primaryTextContrast.value}
          padding={['10px 30px 0 30px', '10px 0 0 0']}
          fontSize="sm"
        >
          Todos los derechos le pertenecen a sus respectivos autores, este proyecto fue realizado
          sin fines de lucro.
        </Text>
      </div>
    </SimpleGrid>
  );
}

function BulletList() {
  return bulletPoints.map((bulletPoint, index) => (
    <BulletPoint
      key={index}
      Icon={bulletPoint.icon}
      title={bulletPoint.title}
      content={bulletPoint.content}
      marginBottom="30px"
      paddingLeft="30px"
    />
  ));
}

const bulletPoints = [
  {
    title: 'Escucha lo que quieras, con quién quieras',
    content: `Crea playlists que contengan a tus artistas, canciones o albumes favoritos. 
    Puedes crear salas y disfrutarlas en grupo.`,
    icon: MdPersonAdd,
  },
  {
    title: 'Perfecto para artistas',
    content: `Sin importar tu experiencia en el campo, te recibimos 
    con los brazos abiertos y ofrecemos el mejor servicio posible.`,
    icon: MdAlbum,
  },
];
