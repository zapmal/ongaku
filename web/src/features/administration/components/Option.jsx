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

import { Button } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function Option({ type, onClick }) {
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
      {isOpen && <DeleteConfirmation isOpen={isOpen} onClose={onClose} />}
    </>
  );
}

function DeleteConfirmation({ isOpen, onClose }) {
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered={true}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Confirmación
          </AlertDialogHeader>

          <AlertDialogBody>¿Estás seguro? Esta acción no es reversible.</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="link">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={onClose} ml={3} variant="danger">
              Borrar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
