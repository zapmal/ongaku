import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import * as dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import { searchByQuery } from '../api/search';
import { ArtistRow, SongRow, AlbumRow, PlaylistRow, Status } from '../components';

import { Highlight } from '@/components/Utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { capitalizeEach } from '@/utils/capitalizeEach';
import { getImage } from '@/utils/getImage';
import { getName } from '@/utils/getName';

const DIVIDER_WIDTH = '75%';
const HEADING_PROPS = {
  fontSize: '2xl',
  padding: '15px',
};

export function Search() {
  const entity = useAuthStore((s) => s.entity);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const { data, isLoading, isError, refetch } = useQuery('search', () => searchByQuery(query));

  if (isError) throw new Error();

  useEffect(() => {
    refetch();
  }, [query, refetch]);

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
          {data.songs.length === 0 ? (
            <NothingFound section="canciones" />
          ) : (
            data.songs.map((song, index) => (
              <SongRow
                key={index}
                albumId={song.album.id}
                song={song}
                name={song.name}
                cover={getImage('album', song.album.cover, 'default/default_album.png')}
                isExplicit={song.isExplicit}
                authors={
                  song.artist.artisticName
                    ? getName(song.artist.artisticName)
                    : getName(song.artist?.band?.name)
                }
                albumName={capitalizeEach(getName(song.album.name))}
                year={dayjs(song.album.year).format('YYYY')}
              />
            ))
          )}
          <Heading {...HEADING_PROPS}>Artistas</Heading>
          <Divider width={DIVIDER_WIDTH} />
          {data.artists.length === 0 ? (
            <NothingFound section="artistas" />
          ) : (
            data.artists.map((artist, index) => {
              return (
                <ArtistRow
                  key={index}
                  id={artist.id}
                  name={artist.band?.name ? artist.band.name : artist.artisticName}
                  avatar={getImage('artist', artist.avatar, 'default/default_avatar.png')}
                  amountOfFollowers={artist.artistMetrics?.followers}
                  isFollowed={artist.interaction.length !== 0 ? artist.interaction[0].value : false}
                  badge={false}
                />
              );
            })
          )}
          <Heading {...HEADING_PROPS}>Albumes, Singles y EPs</Heading>
          <Divider width={DIVIDER_WIDTH} />
          {data.albums.length === 0 ? (
            <NothingFound section="playlists" />
          ) : (
            data.albums.map((album, index) => (
              <AlbumRow
                id={album.id}
                key={index}
                name={getName(album.name)}
                cover={getImage('album', album.cover, 'default/default_album.png')}
                authors={
                  album.artist?.artisticName ? album.artist.artisticName : album.artist?.band?.name
                }
                type={album.releaseType}
                songs={album.song}
                year={dayjs(album.year).format('YYYY')}
              />
            ))
          )}
          {entity.role !== 'ARTIST' && (
            <>
              <Heading {...HEADING_PROPS}>Playlists</Heading>
              <Divider width={DIVIDER_WIDTH} />
              {data.playlists.length === 0 ? (
                <NothingFound section="playlists" />
              ) : (
                data.playlists.map((playlist, index) => {
                  const songs = playlist.songsInPlaylist.map(({ song }) => ({
                    ...song,
                  }));

                  return (
                    <PlaylistRow
                      key={index}
                      id={playlist.id}
                      name={playlist.name}
                      cover={getImage('playlist', playlist.cover, 'default/default_cover.jpg')}
                      author={playlist.user.username}
                      amountOfSongs={songs.length}
                      noHeart={playlist.userId === entity.id}
                      isLiked={
                        playlist.interaction.length !== 0 ? playlist.interaction[0].value : false
                      }
                      songs={songs}
                    />
                  );
                })
              )}
            </>
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
