/* eslint-disable jsx-a11y/aria-role */
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Divider,
  Avatar,
  Spacer,
  Flex,
  IconButton,
  Icon,
  Tooltip,
  Spinner as ChakraSpinner,
} from '@chakra-ui/react';
import React from 'react';
import { MdCheck, MdExitToApp, MdRefresh } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';

import { addUser, banUser, deleteRoom, getRoom, removeUser } from '../../api/rooms';
import { SongInQueue } from '../../components';
import { FADE_OUT_ANIMATION } from '../../constants';
import { useHover } from '../../hooks/useHover';

import { Link, Button } from '@/components/Elements';
import { Highlight, Spinner } from '@/components/Utils';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useQueueStore } from '@/stores/useQueueStore';
import { useRoomStore } from '@/stores/useRoomStore';
import { copyURL } from '@/utils/copyURL';
import { getImage } from '@/utils/getImage';

export function Room() {
  const navigate = useNavigate();
  const params = useParams();

  const store = useQueueStore();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [room, setRoom] = useRoomStore((s) => [s.room, s.setRoom]);
  const entity = useAuthStore((s) => s.entity);

  const queryClient = useQueryClient();
  const addUserMutation = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(`room-${params.key}`);
    },
  });

  const { data, isLoading, isRefetching, refetch } = useQuery(
    `room-${params.key}`,
    () => getRoom(params.key),
    {
      refetchInterval: 10000,
      onError: () => {
        // create a custom not found page
        navigate('/room-error');
      },
      onSuccess: async (response) => {
        if (
          response.host !== entity.id &&
          response.limit - response.users.length === 0 &&
          !response.users.includes(entity.id) &&
          room.length !== 0
        ) {
          navigate('/room-error');
        }

        if (response.banList.includes(entity.id)) {
          navigate('/rooms');
        } else if (response.host !== entity.id && !response.users.includes(entity.id)) {
          try {
            await addUserMutation.mutateAsync({ key: params.key, userId: entity.id });
          } catch (error) {
            addNotification({
              title: 'Error',
              status: 'error',
              message: error,
            });
          }
        }

        setRoom(response);
        store.add(response.queue);
      },
    }
  );

  const leaveOrCloseRoomMutation = useMutation(
    entity.id === data?.host || entity.role === 'ADMIN' ? deleteRoom : removeUser,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`room-${params.key}`);
        navigate('/rooms');
      },
    }
  );

  const handleLeaveOrCloseRoom = async () => {
    try {
      const requestData =
        entity.id === data.host || entity.role === 'ADMIN'
          ? params.key
          : { key: params.key, userId: entity.id };

      await leaveOrCloseRoomMutation.mutateAsync(requestData);
    } catch (error) {
      addNotification({
        title: 'Error',
        status: 'error',
        message: error,
      });
    } finally {
      setRoom([]);
      store.clearQueue();
    }
  };

  if (isLoading) {
    return <Spinner paddingBottom="15%" />;
  }

  return (
    <Box padding="20px 60px">
      <Flex gap="80px">
        <Box width="80%">
          <Heading>
            {data.name}
            {isRefetching ? (
              <Tooltip label="Estamos actualizando la lista de salas">
                <span>
                  <ChakraSpinner marginLeft="20px" />
                </span>
              </Tooltip>
            ) : (
              <Tooltip label="La lista está al día">
                <span>
                  <Icon as={MdCheck} w="30px" h="30px" marginLeft="20px" />
                </span>
              </Tooltip>
            )}
          </Heading>

          <Text color="whiteAlpha.800" margin="10px 0">
            <Highlight>Cola</Highlight> · {data.queue.length} canciones
          </Text>

          <Divider />

          {data?.queue?.map((current, index) => {
            const author = current.artist.artisticName
              ? current.artist.artisticName
              : current.artist.band.name;

            return (
              <div key={index}>
                <SongInQueue
                  // id={data.id}
                  canEdit={data.host === entity.id}
                  song={current}
                  name={current.name}
                  isExplicit={current.isExplicit}
                  isPlaying={current === store.currentlyPlaying}
                  authors={`${author}${
                    current.collaborators.filter((v) => v !== '').length !== 0
                      ? `,${current.collaborators.join(',')}`
                      : ''
                  }`}
                  itemNumber={index + 1}
                />

                {current?.queue?.length !== index + 1 && <Divider />}
              </div>
            );
          })}
        </Box>

        <Box width="80%">
          <Flex align="center">
            <Heading>Usuarios</Heading>
            <Spacer />
            {entity.id === data.host || entity.role === 'ADMIN' ? (
              <Button variant="danger" onClick={handleLeaveOrCloseRoom}>
                Cerrar Sala
              </Button>
            ) : (
              <Button variant="danger" onClick={handleLeaveOrCloseRoom}>
                Dejar sala
              </Button>
            )}
            <Button
              onClick={refetch}
              rightIcon={<Icon as={MdRefresh} w="25px" h="25px" />}
              marginLeft="10px"
            >
              Refrescar
            </Button>
            <Button marginLeft="10px" onClick={() => copyURL(`room/${params.key}`)}>
              Invitar
            </Button>
          </Flex>

          <Text color="whiteAlpha.800" margin="10px 0">
            {data.limit - data.users.length === 0
              ? 'La sala está full'
              : data.limit - data.users.length === 1
              ? 'Queda 1 espacio en la sala'
              : `Aún quedan ${data.limit - data.users.length} espacios en la sala`}{' '}
            -{' '}
            <Highlight>
              {data.users.length}/{data.limit} usuarios
            </Highlight>
          </Text>

          <Divider />

          {data.users.length === 0 ? (
            <Box textAlign="center" marginTop="20px" paddingBottom="50%">
              <Text color="whiteAlpha.700">No hay usuarios, por ahora {';)'}</Text>
            </Box>
          ) : (
            <SimpleGrid
              columns={3}
              margin="10px 0"
              paddingBottom={data.users.length <= 3 ? '40%' : 0}
            >
              {data.usersData.map((user, index) => (
                <User
                  key={index}
                  id={user.id}
                  name={user.fullName}
                  role={user.role}
                  avatar={user.avatar}
                  to={user.username}
                  hostId={data.host}
                  roomKey={params.key}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

function User({ avatar, role, name, to, id, hostId, roomKey }) {
  const [isHovered, mouseEventsHandlers] = useHover();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const entity = useAuthStore((s) => s.entity);
  const canBan = hostId === entity.id || entity.role === 'ADMIN';

  const queryClient = useQueryClient();
  const mutation = useMutation(banUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(`room-${roomKey}`);
    },
  });

  const handleKick = async () => {
    try {
      await mutation.mutateAsync({ key: roomKey, userId: id });
    } catch (error) {
      addNotification({
        title: 'Error',
        status: 'error',
        message: error,
      });
    }
  };

  return (
    <Flex align="center" flexDir="column" margin="10px 0">
      <Avatar
        {...mouseEventsHandlers}
        size="xl"
        src={getImage('user', avatar, 'default/default_avatar.svg')}
        opacity={isHovered && canBan && 0.6}
        transition="opacity 150ms ease-in"
        _hover={{ cursor: canBan ? 'pointer' : 'auto' }}
        border={`3px solid ${theme.colors.successSolid.value}`}
      />
      {isHovered && canBan && (
        <Box
          animation={FADE_OUT_ANIMATION}
          textAlign="left"
          position="relative"
          {...mouseEventsHandlers}
        >
          <IconButton
            icon={<Icon as={MdExitToApp} w="20px" h="20px" />}
            position="absolute"
            onClick={handleKick}
            bottom="25px"
            left="-20px"
            backgroundColor={theme.colors.dangerSolid.value}
            _hover={{
              backgroundColor: theme.colors.dangerSolidHover.value,
            }}
            _active={{
              backgroundColor: theme.colors.dangerSolidActive.value,
            }}
          />
        </Box>
      )}
      <Text fontSize="xs" color="whiteAlpha.700" fontWeight="bold">
        {role}
      </Text>
      <Text fontWeight="bold" as={Link} to={`/user/${to}`} underline={false}>
        {name}
      </Text>
    </Flex>
  );
}
