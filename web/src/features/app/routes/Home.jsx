import { Box, Heading, SimpleGrid, Flex, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useQuery } from 'react-query';

import { getHomeData } from '../api/home';
import { SongCard, ArtistCard, FeaturedArtistInformation, PerfectForYou } from '../components';
import { GRADIENTS, SECTION_MARGIN, SUB_SECTION_MARGIN, GRID_COLUMN_HEIGHT } from '../constants';

import { Footer } from '@/components/Core';
import { Banner } from '@/components/Elements';
import { Highlight, Spinner } from '@/components/Utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { getImage } from '@/utils/getImage';

export function Home() {
  const { data, isLoading } = useQuery('home', getHomeData, { useErrorBoundary: true });
  const entity = useAuthStore((s) => s.entity);

  if (isLoading) {
    return <Spinner paddingBottom="30%" />;
  }

  return (
    <>
      <Banner
        image={getImage(
          'artist',
          data.artistOfTheMonth.artistInformation.coverImage,
          'default_cover.svg'
        )}
      >
        <SimpleGrid
          gridAutoFlow="column"
          alignItems="end"
          justifyItems="start"
          height="100%"
          padding="20px"
          columns={2}
          bg={GRADIENTS.bottom}
        >
          <FeaturedArtistInformation
            name={data.artistOfTheMonth.band.name}
            amountOfFollowers={data.artistOfTheMonth.artistMetrics.followers}
            description={`
              (G)I-dle (en hangul, (여자)아이들; romanización revisada del coreano, Yeoja Aideul; abreviatura de GIRL-I-DLE; 
              estilizado como (G)I-DLE), es un grupo musical femenino formado por Cube Entertainment en 2018. El grupo consta de cinco integrantes: 
              Miyeon, Minnie, Soyeon, Yuqi y Shuhua.`}
          />

          <Box height={GRID_COLUMN_HEIGHT}>
            <Flex>
              {data.artistOfTheMonth.album.map((album, index) => (
                <SongCard
                  key={index}
                  cover={getImage('album', album.cover, 'default_album.png')}
                  name={album.name}
                  isExplicit={album.isExplicit}
                  type={album.releaseType}
                  authors={data.artistOfTheMonth.band.name}
                  isLiked={album.interaction.length !== 0 ? album.interaction[0].value : false}
                  id={album.id}
                  year={dayjs(album.year).format('YYYY')}
                  notLikeable={entity.role === 'ARTIST'}
                />
              ))}
            </Flex>
          </Box>
        </SimpleGrid>
      </Banner>

      <Box margin="0 20px">
        <Heading>
          <Highlight>Artistas</Highlight> Sugeridos
        </Heading>
        <Text color="whiteAlpha.800" margin="10px 0">
          Artistas populares, nuevos o en tendencia que puede te gusten.
        </Text>
      </Box>

      <SimpleGrid column={4} gridAutoFlow="column" justifyItems="center">
        {data.suggestedArtists.map((artist, index) => (
          <ArtistCard
            key={index}
            name={artist.artisticName ? artist.artisticName : artist.band?.name}
            avatar={getImage('artist', artist.avatar, 'default_avatar.png')}
            amountOfFollowers={artist.artistMetrics.followers}
            isHighlighted={index % 2 === 0}
          />
        ))}
      </SimpleGrid>

      <Box margin={SECTION_MARGIN}>
        <Heading>
          Perfecto para <Highlight>ti</Highlight>
        </Heading>
        <Text color="whiteAlpha.800" marginTop="10px">
          Es uno de los artistas más populares en la plataforma últimamente, probablemente se adapte
          a tu estilo también {';)'}
        </Text>

        <PerfectForYou
          name={data.perfectForYou.artisticName}
          country={data.perfectForYou.country}
          labels={data.perfectForYou.labels}
          description={`Karen, mejor conocida online como DEMONDICE es una YouTuber Américana viviendo en japón 
            que es mayormente conocida por su rap, producción de videos músicales y animación.`}
          genres={data.perfectForYou.genres}
          followers={data.perfectForYou.artistMetrics.followers}
          image={getImage(
            'artist',
            data.perfectForYou.artistInformation.coverImage,
            'default_avatar.png'
          )}
          pageURL={`/artist/${data.perfectForYou.artisticName}`}
          youtubeChannelURL="https://youtube.com/c/DEMONDICE"
        />
      </Box>

      <Box margin={SECTION_MARGIN}>
        <Heading>
          <Highlight>Tendencias</Highlight>
        </Heading>
        <Text color="whiteAlpha.800" marginTop="10px">
          Artistas, canciones o playlists más escuchadas en las últimas 48 horas.
        </Text>
      </Box>

      <SimpleGrid column={5}>
        <Flex margin={SUB_SECTION_MARGIN} justify="space-evenly" align="center">
          {data.trending.albums.map((album, index) => (
            <SongCard
              key={index}
              id={album.id}
              isLiked={album.interaction.length !== 0 ? album.interaction[0].value : false}
              cover={getImage('album', album.cover, 'default_album.png')}
              name={album.name}
              isExplicit={album.isExplicit}
              type={album.releaseType}
              authors={
                album.artist.artisticName ? album.artist.artisticName : album.artist?.band?.name
              }
              year={dayjs(album.year).format('YYYY')}
              notLikeable={entity.id === album.artistId || entity.role === 'ARTIST'}
            />
          ))}
          {data.trending.artists.map((artist, index) => (
            <ArtistCard
              key={index}
              artistId={artist.id}
              name={artist.artisticName ? artist.artisticName : artist.band?.name}
              isFollowed={artist.interaction.length !== 0 ? artist.interaction[0].value : false}
              avatar={getImage('artist', artist.avatar, 'default_avatar.png')}
              amountOfFollowers={artist.artistMetrics.followers}
              size="sm"
            />
          ))}
        </Flex>
      </SimpleGrid>

      <Footer topMargin={SUB_SECTION_MARGIN} />
    </>
  );
}
