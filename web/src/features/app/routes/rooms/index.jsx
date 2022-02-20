import { Box, Flex, Heading, Spacer, Text, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { RoomRow, CreateNewRoom } from '../../components';
import { PUBLIC_ROOMS } from '../../constants';

import { Button } from '@/components/Elements';
import { Field } from '@/components/Form';

export function Rooms() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roomName: '',
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = () => console.log('hey');

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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex gap="20px" margin="0 20px 40px 20px">
            <Field
              type="text"
              name="roomName"
              label="Buscar Sala"
              placeholder="Sala de José"
              error={errors.roomName}
              register={register}
            />
          </Flex>
        </form>
        <Button variant="accent" onClick={onOpen}>
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

const schema = yup.object({
  roomName: yup.string(),
});
