import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';

import { createPlaylist } from '../api/playlist';

import { Button } from '@/components/Elements';
import { Field } from '@/components/Form';
import { useRequest } from '@/hooks';

export function CreateNewPlaylist({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  });
  const [request, setRequestState] = useRequest();

  const queryClient = useQueryClient();
  const mutation = useMutation(createPlaylist, {
    onSuccess: () => queryClient.invalidateQueries('playlists'),
  });

  const onSubmit = async (data) => {
    try {
      const response = await mutation.mutateAsync(data);

      setRequestState({
        status: 'success',
        title: '¡Éxito!',
        message: response.message,
      });

      onClose();
    } catch (error) {
      setRequestState({
        status: 'error',
        title: 'Error',
        message: error,
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        preserveScrollBarGap={true}
        isCentered
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent width={['75%', '80%']}>
            <ModalHeader>
              <Heading fontSize="xl">Crea una nueva Playlist</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Field
                type="text"
                name="name"
                label="Nombre de la Playlist"
                placeholder="OnlyBangers"
                css={{ marginBottom: '10px' }}
                error={errors.name}
                isDisabled={request.status != ''}
                register={register}
              />
              <Field
                type="file"
                name="cover"
                label="Portada"
                css={{ marginBottom: '10px' }}
                isDisabled={request.status != ''}
                register={register}
              />
              <Field
                type="file"
                name="background"
                label="Fondo"
                isDisabled={request.status != ''}
                register={register}
              />
            </ModalBody>
            <ModalFooter margin="0 auto">
              {isSubmitting ? (
                <Spinner size="lg" />
              ) : (
                <>
                  <Button variant="accent" type="submit" isDisabled={request.status != ''}>
                    Crear
                  </Button>
                  <Text
                    textDecoration="underline"
                    fontSize="sm"
                    color="whiteAlpha.700"
                    margin="0 20px"
                    onClick={onClose}
                    _hover={{ cursor: 'pointer' }}
                  >
                    Cancelar
                  </Text>
                </>
              )}
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

const schema = yup.object({
  name: yup.string().required('Este campo es requerido'),
});
