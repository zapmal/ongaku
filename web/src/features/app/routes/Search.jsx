import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { ArtistRow, SongRow, AlbumRow, PlaylistRow } from '../components';
import {
  ALBUMS_SEARCH_RESULTS,
  ARTIST_SEARCH_RESULT,
  PLAYLISTS_SEARCH_RESULTS,
  SONGS_SEARCH_RESULT,
} from '../constants';

import { Highlight } from '@/components/Utils';

const DIVIDER_WIDTH = '75%';
const HEADING_PROPS = {
  fontSize: '2xl',
  padding: '15px',
};

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  return (
    <Box width="80%" align="center" margin="0 auto">
      <Heading fontSize="3xl">
        Showing Results for <Highlight>{`"${query}"`} </Highlight>
        <Text fontSize="sm" margin="10px 0" color="whiteAlpha.700" fontWeight="normal">
          Try to avoid ambiguous queries in order to get the best results.
        </Text>
      </Heading>

      <Heading {...HEADING_PROPS}>Songs</Heading>

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

      <Heading {...HEADING_PROPS}>Artists</Heading>

      <Divider width={DIVIDER_WIDTH} />

      {ARTIST_SEARCH_RESULT.map((artist, index) => (
        <ArtistRow
          key={index}
          name={artist.name}
          image={artist.image}
          amountOfFollowers={artist.amountOfFollowers}
          to={artist.to}
          badge={false}
        />
      ))}

      <Heading {...HEADING_PROPS}>Albums, Singles and EPs</Heading>

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

      {PLAYLISTS_SEARCH_RESULTS.map((playlist, index) => (
        <PlaylistRow
          key={index}
          name={playlist.name}
          cover={playlist.cover}
          author={playlist.author}
          amountOfSongs={playlist.amountOfSongs}
        />
      ))}
    </Box>
  );
}
