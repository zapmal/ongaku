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

import { updateProfileData } from '../api/user';

import { Button } from '@/components/Elements';
import { Field } from '@/components/Form';
import { useRequest } from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';

export function EditProfile({ isOpen, onClose, id, fullName, email, username }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: fullName,
      email: email,
    },
  });
  const [entity, setEntity] = useAuthStore((s) => [s.entity, s.setEntity]);
  const [request, setRequestState] = useRequest();
  const queryClient = useQueryClient();
  const mutation = useMutation(updateProfileData, {
    onSuccess: () => {
      queryClient.invalidateQueries(`profile-${username}`);
    },
  });

  const onSubmit = async (data) => {
    const body = new FormData();
    body.append('id', id);
    body.append('fullName', data.fullName);
    body.append('email', data.email);
    body.append('avatar', data.avatar[0]);

    try {
      const response = await mutation.mutateAsync(body);

      if (entity.id === response.user.id) {
        setEntity(response.user);
      }

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
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Field
                type="text"
                name="fullName"
                label="Nombre"
                placeholder="Nick Powers"
                css={{ marginBottom: '10px' }}
                error={errors.fullName}
                isDisabled={request.status != ''}
                register={register}
              />
              <Field
                type="email"
                name="email"
                label="Email"
                placeholder="nick@powers.com"
                css={{ marginBottom: '10px' }}
                error={errors.email}
                isDisabled={request.status != ''}
                register={register}
              />
              <Field
                type="file"
                name="avatar"
                label="Foto de Perfil"
                isDisabled={request.status != ''}
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
    </>
  );
}

const schema = yup.object({
  fullName: yup.string(),
  email: yup.string().email('Debes ingresar un correo v??lido'),
});
