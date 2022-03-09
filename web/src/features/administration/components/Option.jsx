import {
  IconButton,
  Icon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiTrash, FiEdit } from 'react-icons/fi';
import { useMutation, useQueryClient } from 'react-query';

import { deleteUser, deleteArtist } from '../api/entities';
import { deleteAlbum, deleteSong } from '../api/work';

import { Button } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

export function Option({ type, onClick, id, itemType }) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  return type === 'edit' ? (
    <IconButton
      icon={<Icon as={FiEdit} />}
      variant="outline"
      onClick={onClick}
      backgroundColor={theme.colors.accentSolid.value}
      borderColor="transparent"
      _hover={{ bg: theme.colors.accentSolidHover.value }}
      _active={{ bg: theme.colors.accentSolidActive.value }}
    />
  ) : (
    <>
      <IconButton
        icon={<Icon as={FiTrash} />}
        variant="outline"
        marginLeft="10px"
        onClick={() => setIsOpen(true)}
        borderColor="transparent"
        backgroundColor={theme.colors.dangerSolid.value}
        _hover={{ bg: theme.colors.dangerSolidHover.value }}
        _active={{ bg: theme.colors.dangerSolidActive.value }}
      />
      {isOpen && <DeleteConfirmation isOpen={isOpen} onClose={onClose} id={id} type={itemType} />}
    </>
  );
}

const deleteMutations = {
  user: deleteUser,
  artist: deleteArtist,
  album: deleteAlbum,
  song: deleteSong,
};

function DeleteConfirmation({ isOpen, onClose, id, type }) {
  const queryClient = useQueryClient();
  const entity = useAuthStore((s) => s.entity);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const mutation = useMutation(deleteMutations[type], {
    onSuccess: () => {
      if (type === 'user') queryClient.invalidateQueries('admin-users');
      if (type === 'artist') queryClient.invalidateQueries('admin-artists');
      if (type === 'album') queryClient.invalidateQueries('admin-albums');
      if (type === 'song') queryClient.invalidateQueries('admin-songs');
    },
  });

  const handleOnClick = async () => {
    try {
      if ((type === 'user' || type === 'artist') && entity.id === id) {
        addNotification({
          title: 'Error',
          status: 'error',
          message: 'No te puedes borrar a ti mismo',
        });
      } else {
        await mutation.mutateAsync(id);
      }
    } catch (error) {
      console.log('Error al intentar eliminar', error);
    } finally {
      onClose();
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} isCentered={true}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Confirmación
          </AlertDialogHeader>

          <AlertDialogBody>¿Estás seguro? Esta acción no es reversible.</AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose} variant="link">
              Cancelar
            </Button>
            <Button colorScheme="red" ml={3} variant="danger" onClick={handleOnClick}>
              Borrar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
