import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';

import { editArtist } from '../api/entities';

import { Button } from '@/components/Elements';
import { Field } from '@/components/Form';
import { useRequest } from '@/hooks';

export function EditArtist({ isOpen, onClose, artist }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: artist.email,
      artisticName: artist.artisticName ? artist.artisticName : artist?.band?.name,
      members: artist?.band?.members.map((m) => m).toString(),
      yearsActive: artist.yearsActive,
      labels: artist.labels.map((l) => l).toString(),
    },
  });

  const [request, setRequestState] = useRequest();

  const queryClient = useQueryClient();
  const mutation = useMutation(editArtist, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-artists');
    },
  });

  const onSubmit = async (data) => {
    const body = new FormData();
    body.append('id', artist.id);
    body.append('email', data.email);
    body.append('yearsActive', data.yearsActive);
    body.append('labels', data.labels);

    if (data.members) {
      body.append('members', data.members);
    }
    body.append('artisticName', data.artisticName);
    body.append('isAdminEdit', true);

    try {
      const response = await mutation.mutateAsync(body);
      setRequestState({
        status: 'success',
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      preserveScrollBarGap={true}
      isCentered
    >
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Field
              type="email"
              name="email"
              label="Email"
              placeholder="theuser@gmail.com"
              css={{ marginBottom: '10px' }}
              register={register}
              isDisabled={request.status !== ''}
            />
            <Field
              type="text"
              name="labels"
              label="Discográfica(s)"
              placeholder="BigHit, EC0, etc"
              css={{ marginBottom: '10px' }}
              register={register}
              isDisabled={request.status !== ''}
            />
            <Field
              type="text"
              name="artisticName"
              label="Nombre Artístico"
              placeholder="The JAzzy"
              css={{ marginBottom: '10px' }}
              register={register}
              isDisabled={request.status !== ''}
            />
            {artist?.band?.members && (
              <Field
                type="text"
                helperText="Debe separarlo por comas (,)"
                name="members"
                label="Miembros"
                placeholder="JOe, Mia, Ma"
                css={{ marginBottom: '10px' }}
                register={register}
                isDisabled={request.status !== ''}
              />
            )}
            <Field
              type="number"
              name="yearsActive"
              label="Años Activo"
              placeholder="3, 4, 0"
              css={{ marginBottom: '10px' }}
              register={register}
              isDisabled={request.status !== ''}
            />
          </ModalBody>
          <ModalFooter margin="0 auto">
            {isSubmitting ? (
              <Spinner size="lg" />
            ) : (
              <>
                <Button variant="accent" type="submit">
                  Cambiar
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
  );
}

const schema = yup.object({
  email: yup.string().email('Debes proveer un email válido'),
  artisticName: yup.string().nullable(),
  members: yup.string().nullable(),
  yearsActive: yup.number(),
  labels: yup.string(),
});
