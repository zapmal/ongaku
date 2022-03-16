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
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient, useMutation } from 'react-query';
import * as yup from 'yup';

import { createSong, updateSong } from '../api/work';

import { Button } from '@/components/Elements';
import { Field, Checkbox } from '@/components/Form';
import { useRequest } from '@/hooks';
import { getName } from '@/utils/getName';

export function SongModal({ isOpen, onClose, shouldValidate, song, artistId }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(shouldValidate ? schema : editSchema),
    defaultValues: {
      name: !shouldValidate ? song.name : '',
      collaborators: !shouldValidate ? song.collaborators.map((c) => getName(c)).toString() : '',
      isExplicit: !shouldValidate ? song.isExplicit : false,
      artistId: artistId,
    },
  });
  const [request, setRequestState] = useRequest();

  const [isExplicit, setExplicit] = useState(song.isExplicit);

  const queryClient = useQueryClient();
  const mutation = useMutation(shouldValidate ? createSong : updateSong, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-songs');
    },
  });

  const handleExplicitChange = () => setExplicit(!isExplicit);

  const onSubmit = async (data) => {
    const body = new FormData();

    if (shouldValidate) {
      body.append('song', data.song[0]);
      body.append('name', data.name);
      body.append('collaborators', data.collaborators);
      body.append('isExplicit', data.isExplicit);
      body.append('albumId', song.albumId ? song.albumId : data.albumId);

      if (artistId) {
        body.append('artistId', artistId);
      } else {
        body.append('artistId', song.artistId ? song.artistId : data.artistId);
      }
    }

    try {
      const response = await mutation.mutateAsync(
        shouldValidate
          ? body
          : {
              id: song.id,
              name: data.name,
              collaborators: data.collaborators,
              isExplicit: data.isExplicit,
            }
      );
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
              type="text"
              name="name"
              label="Nombre"
              placeholder="Down Horrendous"
              css={{ marginBottom: '10px' }}
              error={errors.name}
              isDisabled={request.status !== ''}
              register={register}
            />
            <Field
              type="text"
              name="collaborators"
              label="Artistas que colaboraron en la canción (si aplica)"
              placeholder="Lady Gaga, Don Omar, etc"
              helperText="Los artistas deben ir separados por comas (,)"
              css={{ marginBottom: '10px' }}
              isDisabled={request.status !== ''}
              error={errors.collaborators}
              register={register}
            />
            {shouldValidate && !artistId && (
              <>
                <Field
                  type="number"
                  name="albumId"
                  label="ID del Album"
                  placeholder="13, 15, 1"
                  helperText="La ID del album, visible en la tabla inferior"
                  css={{ marginBottom: '10px' }}
                  isDisabled={request.status !== ''}
                  error={errors.albumId}
                  register={register}
                />
                <Field
                  type="number"
                  name="artistId"
                  label="ID del Artista"
                  placeholder="13, 15, 1"
                  helperText="La ID del artista, visible en la tabla superior"
                  css={{ marginBottom: '10px' }}
                  isDisabled={request.status !== ''}
                  error={errors.artistId}
                  register={register}
                />
                <Field
                  type="file"
                  name="song"
                  label="Archivo"
                  isDisabled={request.status !== ''}
                  css={{ marginBottom: '10px' }}
                  register={register}
                />
              </>
            )}
            <Checkbox
              name="isExplicit"
              text="¿Es Explicito?"
              control={control}
              onChangeHandler={handleExplicitChange}
              value={isExplicit}
              defaultChecked={isExplicit}
              isDisabled={request.status !== ''}
              size="md"
              padding="5px 0"
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
  name: yup.string().required('Este campo es requerido'),
  collaborators: yup.string(),
  albumId: yup.number().required('Este campo es requerido'),
  artistId: yup.number().required('Este campo es requerido'),
  isExplicit: yup.boolean().required('Este campo es requerido'),
});

const editSchema = yup.object({
  name: yup.string(),
  collaborators: yup.string(),
  isExplicit: yup.boolean(),
});
