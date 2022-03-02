import {
  Box,
  Flex,
  Heading,
  Spacer,
  Text,
  SimpleGrid,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { MdAdd } from 'react-icons/md';

import { RoomRow, CreateNewRoom } from '../../components';
import { PUBLIC_ROOMS } from '../../constants';

import { Button } from '@/components/Elements';

export function Rooms() {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      </Flex>

      <SimpleGrid columns={2}>
        {PUBLIC_ROOMS.map((room, index) => (
          <RoomRow
            key={index}
            name={room.name}
            activeUsers={room.activeUsers}
            userLimit={room.userLimit}
            host={room.host}
            startedAt={room.startedAt}
            genres={room.genres}
            roomId={room.roomId}
          />
        ))}
      </SimpleGrid>
      {isOpen && <CreateNewRoom isOpen={isOpen} onClose={onClose} />}
    </Box>
  );
}
