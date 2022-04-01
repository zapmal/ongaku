import {
  Modal,
  Textarea,
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

import { updateProfileData } from '../api/artist';

import { Button } from '@/components/Elements';
import { Field } from '@/components/Form';
import { useRequest } from '@/hooks';

export function EditArtistProfile({ isOpen, onClose, id, name, officialWebsite, biography }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      officialWebsite: officialWebsite || '',
      biography: biography || '',
    },
  });
  const [request, setRequestState] = useRequest();

  const queryClient = useQueryClient();
  const mutation = useMutation(updateProfileData, {
    onSuccess: () => {
      queryClient.invalidateQueries(`artist-${name}`);
    },
  });

  const onSubmit = async (data) => {
    const body = new FormData();
    body.append('id', id);
    body.append('officialWebsite', data.officialWebsite);
    body.append('biography', data.biography);
    body.append('cover', data.cover[0]);
    body.append('avatar', data.avatar[0]);

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
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Field
                type="text"
                name="officialWebsite"
                label="Sitio Oficial"
                placeholder="example-records.net"
                css={{ marginBottom: '10px' }}
                error={errors.officialWebsite}
                register={register}
                isDisabled={request.status != ''}
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
                name="avatar"
                label="Avatar"
                css={{ marginBottom: '10px' }}
                isDisabled={request.status != ''}
                register={register}
              />
              <Text fontWeight="bold" fontSize="sm" margin="10px 3px 15px">
                Biografía
              </Text>
              <Textarea
                name="biography"
                isDisabled={request.status != ''}
                placeholder="Biografía"
                resize="none"
                marginBottom="10px"
                {...register('biography')}
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
    </>
  );
}

const schema = yup.object({
  officialWebsite: yup.string().url('Debes proveer una URL válida'),
  biography: yup.string(),
});
