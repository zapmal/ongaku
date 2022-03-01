import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import { searchByQuery } from '../api/search';
import { ArtistRow, SongRow, AlbumRow, PlaylistRow, Status } from '../components';
import { ALBUMS_SEARCH_RESULTS, SONGS_SEARCH_RESULT } from '../constants';

import { Highlight } from '@/components/Utils';

const DIVIDER_WIDTH = '75%';
const HEADING_PROPS = {
  fontSize: '2xl',
  padding: '15px',
};

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const { data, isLoading, isError } = useQuery('search', () => searchByQuery(query));

  if (isError) throw new Error();

  console.log(data);
  return (
    <Box width="80%" align="center" margin="0 auto">
      <Heading fontSize="3xl">
        Mostrando resultados para <Highlight>{`"${query}"`} </Highlight>
        <Text fontSize="sm" margin="10px 0" color="whiteAlpha.700" fontWeight="normal">
          Intenta evitar búsquedas ambiguas, así podrás obtener los mejores resultados.
        </Text>
      </Heading>
      {isLoading ? (
        <Box height="385px">
          <Status status="loading" message="Estamos buscando, espera pacientemente." />
        </Box>
      ) : (
        <>
          <Heading {...HEADING_PROPS}>Canciones</Heading>
          <Divider width={DIVIDER_WIDTH} />
          {SONGS_SEARCH_RESULT.map((song, index) => (
            <SongRow
              key={index}
              name={song.name}
              cover={song.cover}
              isExplicit={song.isExplicit}
              authors={song.authors}
              albumName={song.albumName}
              year={song.year}
              duration={song.duration}
            />
          ))}
          <Heading {...HEADING_PROPS}>Artistas</Heading>
          <Divider width={DIVIDER_WIDTH} />
          {data.artists.length === 0 ? (
            <NothingFound section="artistas" />
          ) : (
            data.artists.map((artist, index) => (
              <ArtistRow
                key={index}
                name={artist.artisticName}
                avatar={artist.avatar}
                amountOfFollowers={artist.amountOfFollowers}
                badge={false}
              />
            ))
          )}
          <Heading {...HEADING_PROPS}>Albumes, Singles y EPs</Heading>
          <Divider width={DIVIDER_WIDTH} />
          {ALBUMS_SEARCH_RESULTS.map((album, index) => (
            <AlbumRow
              key={index}
              name={album.name}
              cover={album.cover}
              authors={album.authors}
              type={album.type}
              year={album.year}
            />
          ))}
          <Heading {...HEADING_PROPS}>Playlists</Heading>
          <Divider width={DIVIDER_WIDTH} />
          {data.playlists.length === 0 ? (
            <NothingFound section="playlists" />
          ) : (
            data.playlists.map((playlist, index) => (
              <PlaylistRow
                key={index}
                name={playlist.name}
                cover={`${import.meta.env.VITE_NODE_API_URL}/static/playlist/${playlist.cover}`}
                author="example"
                amountOfSongs="32"
                // author={playlist.author}
                // amountOfSongs={playlist.amountOfSongs}
              />
            ))
          )}
        </>
      )}
    </Box>
  );
}

function NothingFound({ section }) {
  return (
    <Text color="whiteAlpha.700" margin="10px">
      No encontramos {section} bajo ese término.
    </Text>
  );
}
