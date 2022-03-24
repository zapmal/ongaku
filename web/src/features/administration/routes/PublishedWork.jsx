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
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useQuery } from 'react-query';

import { getAllAlbums, getAllSongs, getArtistSongs, getArtistAlbums } from '../api/work';
import { Option, SongModal, AlbumModal } from '../components';
import { SUB_HEADER_MARGIN, TABLE_PROPS, TABLE_ROW_PROPS } from '../constants';

import { Footer } from '@/components/Core';
import { Button } from '@/components/Elements';
import { Spinner } from '@/components/Utils';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { getImage } from '@/utils/getImage';
import { getName } from '@/utils/getName';

export function PublishedWork() {
  const entity = useAuthStore((s) => s.entity);

  const {
    data: songs,
    isLoading: isLoadingSongs,
    isSongsError,
  } = useQuery(
    'admin-songs',
    entity.role === 'ARTIST' ? () => getArtistSongs(entity.id) : getAllSongs
  );
  const {
    data: albums,
    isLoading: isLoadingAlbums,
    isAlbumsError,
  } = useQuery(
    'admin-albums',
    entity.role === 'ARTIST' ? () => getArtistAlbums(entity.id) : getAllAlbums
  );
  const [toEdit, setToEdit] = useState({});

  const {
    isOpen: isSongModalOpen,
    onClose: onSongModalClose,
    onOpen: onSongModalOpen,
  } = useDisclosure();
  const [shouldValidateSong, setShouldValidateSong] = useState(false);

  const handleEditSongOpen = (song) => {
    onSongModalOpen();
    setToEdit(song);
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

  const handleEditAlbumOpen = (album) => {
    onAlbumModalOpen();
    setToEdit(album);
    setShouldValidateAlbum(false);
  };

  const handleNewAlbumOpen = () => {
    onAlbumModalOpen();
    setShouldValidateAlbum(true);
  };

  if (isLoadingSongs || isLoadingAlbums) {
    return <Spinner paddingBottom="100%" />;
  }

  if (isSongsError || isAlbumsError) throw new Error();

  return (
    <>
      <Box paddingTop="10px">
        <Box margin="0 20px" textAlign="center">
          <Heading>Administración de Canciones</Heading>
          <Text color="whiteAlpha.800" marginTop="10px">
            Las acciones realizadas en esta página son irreversibles, tomelo en cuenta al hacer
            alguna.
          </Text>

          <Button rightIcon={<Icon as={MdAdd} />} marginTop="20px" onClick={handleNewSongOpen}>
            Publicar nueva
          </Button>
        </Box>

        <Table {...TABLE_PROPS}>
          <Thead color={theme.colors.accentText.value}>
            <Tr>
              <Th color="inherit">id</Th>
              <Th color="inherit">Nombre</Th>
              <Th color="inherit">Colaboradores</Th>
              <Th color="inherit">Explicito</Th>
              <Th color="inherit">ID de Album</Th>
              <Th color="inherit">Opciones</Th>
            </Tr>
          </Thead>
          {songs?.length !== 0 && (
            <Tbody>
              {songs?.map((song, index) => (
                <Tr key={index} {...TABLE_ROW_PROPS}>
                  <Td>{song.id}</Td>
                  <Td>{song.name}</Td>
                  <Td>
                    {song?.collaborators[0] !== '' && song.collaborators.length !== 0
                      ? song?.collaborators.map((collaborator, index) => {
                          return song?.collaborators.length !== index + 1
                            ? `${getName(collaborator)}, `
                            : getName(collaborator);
                        })
                      : 'Ninguno'}
                  </Td>
                  <Td>{song.isExplicit ? 'Sí' : 'No'}</Td>
                  <Td>{song.albumId}</Td>
                  <Td>
                    <Option type="edit" onClick={() => handleEditSongOpen(song)} />
                    <Option type="delete" itemType="song" id={song.id} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>

        <Box textAlign="center" margin={SUB_HEADER_MARGIN}>
          <Heading>Administración de Albumes, EP y Singles</Heading>
          <Button rightIcon={<Icon as={MdAdd} />} marginTop="20px" onClick={handleNewAlbumOpen}>
            Publicar nuevo
          </Button>
        </Box>
        <Table {...TABLE_PROPS}>
          <Thead color={theme.colors.accentText.value}>
            <Tr>
              <Th color="inherit">Id</Th>
              <Th color="inherit">Portada</Th>
              <Th color="inherit">Nombre</Th>
              <Th color="inherit">Año</Th>
              <Th color="inherit">Tipo</Th>
              <Th color="inherit">ID de Artista</Th>
              <Th color="inherit">Opciones</Th>
            </Tr>
          </Thead>
          {albums.length !== 0 && (
            <Tbody>
              {albums?.map((album, index) => (
                <Tr key={index} {...TABLE_ROW_PROPS}>
                  <Td>{album.id}</Td>
                  <Td>
                    <Image
                      src={getImage('album', album.cover, 'default_cover.png')}
                      w="50px"
                      h="50px"
                      borderRadius="5px"
                    />
                  </Td>
                  <Td>{getName(album.name)}</Td>
                  <Td>{dayjs(album.year).add(1, 'day').format('YYYY')}</Td>
                  <Td>{album.releaseType}</Td>
                  <Td>{album.artistId}</Td>
                  <Td>
                    <Option type="edit" onClick={() => handleEditAlbumOpen(album)} />
                    <Option type="delete" itemType="album" id={album.id} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>

        <Footer topMargin="30px" />
      </Box>
      {isSongModalOpen && (
        <SongModal
          isOpen={isSongModalOpen}
          onClose={onSongModalClose}
          shouldValidate={shouldValidateSong}
          song={toEdit}
          artistId={entity.role === 'ARTIST' ? entity.id : null}
        />
      )}
      {isAlbumModalOpen && (
        <AlbumModal
          isOpen={isAlbumModalOpen}
          onClose={onAlbumModalClose}
          shouldValidate={shouldValidateAlbum}
          album={toEdit}
          artistId={entity.role === 'ARTIST' ? entity.id : null}
        />
      )}
    </>
  );
}
