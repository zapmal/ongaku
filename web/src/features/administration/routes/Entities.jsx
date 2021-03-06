import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import { ROLES_SPANISH } from '../../profiles/constants';
import { getAllUsers, getAllArtists } from '../api/entities';
import { Option, EditEntity, EditEntityMetadata, EditArtist } from '../components';
import { TABLE_PROPS, TABLE_ROW_PROPS, SUB_HEADER_MARGIN } from '../constants';

import { Footer } from '@/components/Core';
import { Spinner } from '@/components/Utils';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { getImage } from '@/utils/getImage';
import { getName } from '@/utils/getName';

export function Entities() {
  const {
    data: users,
    isLoading: isLoadingUsers,
    isUsersError,
  } = useQuery('admin-users', getAllUsers);
  const {
    data: artists,
    isLoading: isLoadingArtists,
    isArtistsError,
  } = useQuery('admin-artists', getAllArtists);
  const [selectedRole, setRole] = useState('USER');
  const [current, setCurrent] = useState([]);
  const [entityToEdit, setEntity] = useState({});

  const entity = useAuthStore((s) => s.entity);

  // king of verbosity
  const {
    isOpen: isEntityEditOpen,
    onClose: onEntityEditClose,
    onOpen: onEntityEditOpen,
  } = useDisclosure();
  const {
    isOpen: isEntityMetadataEditOpen,
    onClose: onEntityMetadataEditClose,
    onOpen: onEntityMetadataEditOpen,
  } = useDisclosure();
  const {
    isOpen: isArtistEditOpen,
    onClose: onArtistEditClose,
    onOpen: onArtistEditOpen,
  } = useDisclosure();

  const handleEntityEdit = (entity) => {
    onEntityEditOpen();
    setEntity(entity);
  };

  const handleEntityMetadataEdit = (entity) => {
    onEntityMetadataEditOpen();
    setEntity(entity);
  };

  const handleArtistEdit = (artist) => {
    onArtistEditOpen();
    setEntity(artist);
  };

  useEffect(() => {
    if (selectedRole === 'USER') setCurrent(users);
    if (selectedRole === 'ADMIN') setCurrent(users.filter((u) => u.role === 'ADMIN'));
  }, [selectedRole, users]);

  if (isLoadingUsers || isLoadingArtists) {
    return <Spinner paddingBottom="20%" />;
  }

  if (isUsersError || isArtistsError) throw new Error();

  return (
    <>
      <Box paddingTop="10px">
        <Box margin="0px 20px" textAlign="center">
          <Heading>Administraci??n de Entidades</Heading>
          <Text color="whiteAlpha.800" marginTop="10px">
            Las acciones realizadas en esta p??gina son irreversibles, tomelo en cuenta al hacer
            alguna.
          </Text>

          <Flex justify="center" gap="10px" marginTop="20px">
            <Text fontSize="lg" marginRight="10px" color="whiteAlpha.800">
              Filtra por rol:
            </Text>
            {buttons.map(({ role }, index) => (
              <Button
                key={index}
                variant="outline"
                borderColor={selectedRole === role && 'transparent'}
                size="sm"
                backgroundColor={selectedRole === role && theme.colors.accentSolid.value}
                onClick={() => setRole(role)}
                _hover={{
                  backgroundColor: theme.colors.accentSolid.value,
                }}
                _active={{
                  backgroundColor: theme.colors.accentSolidActive.value,
                }}
              >
                {ROLES_SPANISH[role]}
              </Button>
            ))}
          </Flex>
        </Box>
        {selectedRole === 'USER' || selectedRole === 'ADMIN' ? (
          <>
            <Table {...TABLE_PROPS}>
              <Thead color={theme.colors.accentText.value}>
                <Tr>
                  <Th color="inherit">id</Th>
                  <Th color="inherit">Avatar</Th>
                  <Th color="inherit">Email</Th>
                  <Th color="inherit">Nombre de Usuario</Th>
                  <Th color="inherit">Nombre</Th>
                  <Th color="inherit">Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {current?.map((user, index) => {
                  if (user.id === entity.id) return null;

                  return (
                    <Tr key={index} {...TABLE_ROW_PROPS}>
                      <Td>{user.id}</Td>
                      <Td>
                        <Image
                          src={getImage('user', user.avatar, 'default_avatar.svg')}
                          w="50px"
                          h="50px"
                          borderRadius="5px"
                        />
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>{user.username}</Td>
                      <Td>{user.fullName}</Td>
                      <Td>
                        <Option type="edit" onClick={() => handleEntityEdit(user)} />
                        {user.id !== entity.id && (
                          <Option type="delete" itemType="user" id={user.id} />
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            <Heading margin={SUB_HEADER_MARGIN} textAlign="center">
              Administraci??n de metadatos
            </Heading>
            <Table {...TABLE_PROPS}>
              <Thead color={theme.colors.accentText.value}>
                <Tr>
                  <Th color="inherit">Fecha de creaci??n</Th>
                  <Th color="inherit">Fecha de actualziaci??n</Th>
                  <Th color="inherit">Activo</Th>
                  <Th color="inherit">Direcci??n IP</Th>
                  <Th color="inherit">Correo Verificado</Th>
                  <Th color="inherit">ID del Usuario</Th>
                  <Th color="inherit">Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {current?.map(({ userMetadata }, index) => {
                  return (
                    Object.keys(userMetadata || {}).length !== 0 && (
                      <Tr key={index} {...TABLE_ROW_PROPS}>
                        <Td>{dayjs(userMetadata.createdAt).format('YYYY-MM-DD')}</Td>
                        <Td>{dayjs(userMetadata.updatedAt).format('YYYY-MM-DD')}</Td>
                        <Td>{userMetadata.active ? 'S??' : 'No'}</Td>
                        <Td>{userMetadata.ipAddress}</Td>
                        <Td>{userMetadata.verifiedEmail ? 'S??' : 'No'}</Td>
                        <Td>{userMetadata.userId}</Td>
                        <Td>
                          <Option
                            type="edit"
                            onClick={() => handleEntityMetadataEdit(userMetadata)}
                          />
                        </Td>
                      </Tr>
                    )
                  );
                })}
              </Tbody>
            </Table>
          </>
        ) : (
          <Table {...TABLE_PROPS}>
            <Thead color={theme.colors.accentText.value}>
              <Tr>
                <Th color="inherit">id</Th>
                <Th color="inherit">Avatar</Th>
                <Th color="inherit">Email</Th>
                <Th color="inherit">Nombre Art??stico</Th>
                <Th color="inherit">Miembros</Th>
                <Th color="inherit">A??os Activo</Th>
                <Th color="inherit">Discogr??fica(s)</Th>
                <Th color="inherit">Opciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {artists?.map((artist, index) => (
                <Tr key={index} {...TABLE_ROW_PROPS}>
                  <Td>{artist.id}</Td>
                  <Td>
                    <Image
                      src={getImage('artist', artist?.avatar, 'default_avatar.png')}
                      w="50px"
                      h="50px"
                      borderRadius="5px"
                    />
                  </Td>
                  <Td fontSize="sm">{artist.email}</Td>
                  <Td>
                    {getName(artist?.artisticName ? artist?.artisticName : artist?.band?.name)}
                  </Td>
                  <Td fontSize="sm">
                    {artist?.band
                      ? artist?.band?.members?.map((member, index) => {
                          return artist?.band?.members.length !== index + 1
                            ? `${member}, `
                            : member;
                        })
                      : 'Ninguno'}
                  </Td>
                  <Td>{artist.yearsActive}</Td>
                  <Td fontSize="sm">
                    {artist.labels.map((label, index) => {
                      return artist.labels.length !== index + 1 ? `${label}, ` : label;
                    })}
                  </Td>
                  <Td width="20%">
                    <Option type="edit" onClick={() => handleArtistEdit(artist)} />
                    <Option type="delete" itemType="artist" id={artist.id} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        <Footer topMargin="30px" />
      </Box>
      {isEntityEditOpen && (
        <EditEntity isOpen={isEntityEditOpen} onClose={onEntityEditClose} entity={entityToEdit} />
      )}
      {isEntityMetadataEditOpen && (
        <EditEntityMetadata
          isOpen={isEntityMetadataEditOpen}
          onClose={onEntityMetadataEditClose}
          metadata={entityToEdit}
        />
      )}
      {isArtistEditOpen && (
        <EditArtist isOpen={isArtistEditOpen} onClose={onArtistEditClose} artist={entityToEdit} />
      )}
    </>
  );
}

const buttons = [
  {
    role: 'USER',
  },
  {
    role: 'ADMIN',
  },
  {
    role: 'ARTIST',
  },
];
