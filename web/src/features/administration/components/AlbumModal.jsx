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
import dayjs from 'dayjs';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';

import { updateAlbum, createAlbum } from '../api/work';

import { Button } from '@/components/Elements';
import { Field, Select } from '@/components/Form';
import { useRequest } from '@/hooks';
import { theme } from '@/stitches.config.js';
import { getLink } from '@/utils/getLink';
import { getName } from '@/utils/getName';

export function AlbumModal({ isOpen, onClose, shouldValidate, album }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(shouldValidate ? schema : editSchema),
    defaultValues: {
      name: !shouldValidate ? getName(album.name) : '',
      year: !shouldValidate ? dayjs(album.year).add(1, 'day').format('YYYY') : '',
      releaseType: !shouldValidate ? album.releaseType : '',
    },
  });
  const [request, setRequestState] = useRequest();

  const queryClient = useQueryClient();
  const mutation = useMutation(shouldValidate ? createAlbum : updateAlbum, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-albums');
    },
  });

  const onSubmit = async (data) => {
    const body = new FormData();
    // eslint-disable-next-line no-unused-vars
    const [_, albumNameLink] = getLink(data.name, data.name);

    if (!shouldValidate) {
      body.append('id', album.id);
    }

    body.append('name', albumNameLink);
    body.append('year', data.year);
    body.append('releaseType', data.releaseType);
    body.append('artistId', album.artistId ? album.artistId : data.artistId);
    body.append('cover', data.cover[0]);

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
              type="text"
              name="name"
              label="Nombre"
              placeholder="The Og Album"
              css={{ marginBottom: '10px' }}
              error={errors.name}
              isDisabled={request.status !== ''}
              register={register}
            />
            {shouldValidate && (
              <Field
                type="number"
                name="artistId"
                label="ID del Artista"
                placeholder="14, 133, 1"
                css={{ marginBottom: '10px' }}
                error={errors.artistId}
                isDisabled={request.status !== ''}
                register={register}
              />
            )}
            <Field
              type="number"
              name="year"
              label="Año"
              placeholder="2014, 2013, 2002"
              css={{ marginBottom: '10px' }}
              error={errors.year}
              isDisabled={request.status !== ''}
              register={register}
            />
            <Text
              textAlign="left"
              marginTop="10px"
              paddingBottom="10px"
              paddingLeft="5px"
              fontWeight="bold"
            >
              Tipo
            </Text>
            <Select
              control={control}
              options={[
                { label: 'EP', value: 'EP' },
                { label: 'SINGLE', value: 'SINGLE' },
                { label: 'ALBUM', value: 'ALBUM' },
              ]}
              name="releaseType"
              placeholder="EP, SINGLE o ALBUM"
              isDisabled={request.status !== ''}
              error={errors.releaseType}
              onChangeCallback={(value) => value.value}
            />
            {errors.releaseType && (
              <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
                {errors.releaseType.message}
              </Text>
            )}
            <Text marginBottom="10px" />
            <Field
              type="file"
              name="cover"
              label="Portada"
              css={{ marginBottom: '10px' }}
              isDisabled={request.status !== ''}
              register={register}
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
  year: yup.string().required('Este campo es requerido'),
  releaseType: yup.string().required('Este campo es requerido'),
  artistId: yup.number().required('Este campo es requerido'),
});

const editSchema = yup.object({
  name: yup.string(),
  year: yup.string(),
  releaseType: yup.string(),
});
