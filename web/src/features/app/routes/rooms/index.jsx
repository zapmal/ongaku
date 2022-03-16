import {
  Box,
  Flex,
  Heading,
  Spacer,
  Text,
  SimpleGrid,
  useDisclosure,
  Icon,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { MdAdd, MdCheck, MdRefresh } from 'react-icons/md';
import { VscEmptyWindow } from 'react-icons/vsc';
import { useQuery } from 'react-query';

import { getAllRooms } from '../../api/rooms';
import { RoomRow, CreateNewRoom } from '../../components';

import { Button } from '@/components/Elements';
import { Spinner as CustomSpinner } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

export function Rooms() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, isError, isRefetching, refetch, error } = useQuery(
    'all-rooms',
    getAllRooms,
    {
      refetchInterval: 10000,
      useErrorBoundary: false,
    }
  );

  return (
    <Box>
      <Flex align="center" margin="0px 50px 0 20px">
        <Heading fontSize="3xl" marginBottom="20px">
          Salas Disponibles
          <Text color="whiteAlpha.800" fontSize="sm" marginTop="10px" fontWeight="normal">
            ¡Pasa el rato disfrutando con gente que comparte el mismo gusto músical que tu!
          </Text>
        </Heading>

        <Spacer />

        <Button variant="accent" onClick={onOpen} rightIcon={<Icon as={MdAdd} w="25px" h="25px" />}>
          Nueva Sala
        </Button>
        <Button
          onClick={refetch}
          rightIcon={<Icon as={MdRefresh} w="25px" h="25px" />}
          marginLeft="10px"
        >
          Refrescar
        </Button>

        {isRefetching ? (
          <Tooltip label="Estamos actualizando la lista de salas">
            <div>
              <Spinner marginLeft="20px" />
            </div>
          </Tooltip>
        ) : (
          <Tooltip label="La lista está al día">
            <div>
              <Icon as={MdCheck} w="30px" h="30px" marginLeft="20px" />
            </div>
          </Tooltip>
        )}
      </Flex>

      {isLoading ? (
        <CustomSpinner paddingBottom="20%" />
      ) : data?.length === 0 || isError ? (
        <Box paddingBottom="20%" textAlign="center" marginTop="70px">
          <Icon as={VscEmptyWindow} h="60px" w="60px" color={theme.colors.accentSolid.value} />
          <Text color="whiteAlpha.700">{error}</Text>
        </Box>
      ) : (
        <SimpleGrid columns={2} paddingBottom="30%">
          {data.map((room, index) => (
            <RoomRow
              key={index}
              name={room.name}
              activeUsers={room.users.length}
              userLimit={room.limit}
              host={room.user.username}
              startedAt={room.createdAt}
              genres={room.genres.toString()}
              roomId={room.key}
            />
          ))}
        </SimpleGrid>
      )}

      {isOpen && <CreateNewRoom isOpen={isOpen} onClose={onClose} />}
    </Box>
  );
}
