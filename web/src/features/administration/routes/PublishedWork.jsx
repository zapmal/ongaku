import {
  Box,
  Text,
  Image,
  Heading,
  Table,
  Thead,
  Icon,
  Tr,
  Th,
  Td,
  Tbody,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { Option, SongModal, AlbumModal } from '../components';
import { SUB_HEADER_MARGIN, TABLE_PROPS, TABLE_ROW_PROPS } from '../constants';

import { Footer } from '@/components/Core';
import { Button } from '@/components/Elements';
import { SONGS, ALBUMS } from '@/features/app';
import { theme } from '@/stitches.config.js';

export function PublishedWork() {
  const {
    isOpen: isSongModalOpen,
    onClose: onSongModalClose,
    onOpen: onSongModalOpen,
  } = useDisclosure();
  const [shouldValidateSong, setShouldValidateSong] = useState(false);

  const handleEditSongOpen = () => {
    onSongModalOpen();
    setShouldValidateSong(false);
  };

  const handleNewSongOpen = () => {
    onSongModalOpen();
    setShouldValidateSong(true);
  };

  const {
    isOpen: isAlbumModalOpen,
    onClose: onAlbumModalClose,
    onOpen: onAlbumModalOpen,
  } = useDisclosure();
  const [shouldValidateAlbum, setShouldValidateAlbum] = useState(false);

  const handleEditAlbumOpen = () => {
    onAlbumModalOpen();
    setShouldValidateAlbum(false);
  };

  const handleNewAlbumOpen = () => {
    onAlbumModalOpen();
    setShouldValidateAlbum(true);
  };

  return (
    <>
      <Box paddingTop="10px">
        <Box margin="0 20px" textAlign="center">
          <Heading>Song Administration</Heading>
          <Text color="whiteAlpha.800" marginTop="10px">
            Every action performed in this page is logged for future audits and security purposes.
          </Text>

          <Button rightIcon={<Icon as={MdAdd} />} marginTop="20px" onClick={handleNewSongOpen}>
            Publish a New Song
          </Button>
        </Box>

        <Table {...TABLE_PROPS}>
          <Thead color={theme.colors.accentText.value}>
            <Tr>
              <Th color="inherit">id</Th>
              <Th color="inherit">Name</Th>
              <Th color="inherit">Length</Th>
              <Th color="inherit">Lyrics</Th>
              <Th color="inherit">Is Explicit</Th>
              <Th color="inherit">Album Id</Th>
              <Th color="inherit">Options</Th>
            </Tr>
          </Thead>
          <Tbody>
            {SONGS.map((song, index) => (
              <Tr key={index} {...TABLE_ROW_PROPS}>
                <Td>{song.id}</Td>
                <Td>{song.name}</Td>
                <Td>{song.length}</Td>
                <Td>{song.lyrics ? 'Available' : 'Not provided'}</Td>
                <Td>{song.isExplicit ? 'Yes' : 'No'}</Td>
                <Td>{song.albumId}</Td>
                <Td>
                  <Option type="edit" onClick={handleEditSongOpen} />
                  <Option type="delete" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Box textAlign="center" margin={SUB_HEADER_MARGIN}>
          <Heading>Album Administration</Heading>
          <Button rightIcon={<Icon as={MdAdd} />} marginTop="20px" onClick={handleNewAlbumOpen}>
            Publish a New Album
          </Button>
        </Box>
        <Table {...TABLE_PROPS}>
          <Thead color={theme.colors.accentText.value}>
            <Tr>
              <Th color="inherit">Id</Th>
              <Th color="inherit">Cover</Th>
              <Th color="inherit">Name</Th>
              <Th color="inherit">Year</Th>
              <Th color="inherit">Release Type</Th>
              <Th color="inherit">Artist ID</Th>
              <Th color="inherit">Options</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ALBUMS.map((album, index) => (
              <Tr key={index} {...TABLE_ROW_PROPS}>
                <Td>{album.id}</Td>
                <Td>
                  <Image src={album.cover} w="50px" h="50px" borderRadius="5px" />
                </Td>
                <Td>{album.name}</Td>
                <Td>{album.year}</Td>
                <Td>{album.releaseType}</Td>
                <Td>{album.artistId}</Td>
                <Td>
                  <Option type="edit" onClick={handleEditAlbumOpen} />
                  <Option type="delete" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Song metadata administration is postponed. */}

        <Footer topMargin="30px" />
      </Box>
      {isSongModalOpen && (
        <SongModal
          isOpen={isSongModalOpen}
          onClose={onSongModalClose}
          shouldValidate={shouldValidateSong}
        />
      )}
      {isAlbumModalOpen && (
        <AlbumModal
          isOpen={isAlbumModalOpen}
          onClose={onAlbumModalClose}
          shouldValidate={shouldValidateAlbum}
        />
      )}
    </>
  );
}
