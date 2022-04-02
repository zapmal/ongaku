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

import { editUser } from '../api/entities';

import { Button } from '@/components/Elements';
import { Field } from '@/components/Form';
import { useRequest } from '@/hooks';
import { getLink } from '@/utils/getLink';
import { getName } from '@/utils/getName';

export function EditEntity({ isOpen, onClose, entity }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: entity.email,
      username: getName(entity.username),
      fullName: entity.fullName,
    },
  });
  const [request, setRequestState] = useRequest();

  const queryClient = useQueryClient();
  const mutation = useMutation(editUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-users');
    },
  });

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-unused-vars
    const [_, username] = getLink(data.username, data.username);

    const body = new FormData();
    body.append('id', entity.id);
    body.append('email', data.email);
    body.append('username', username);
    body.append('fullName', data.fullName);

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
              error={errors.email}
              isDisabled={request.status !== ''}
              register={register}
            />
            <Field
              type="text"
              name="username"
              label="Nombre de Usuario"
              placeholder="Amazi_ngUser_11"
              css={{ marginBottom: '10px' }}
              error={errors.username}
              isDisabled={request.status !== ''}
              register={register}
            />
            <Field
              type="text"
              name="fullName"
              label="Nombre Completo"
              placeholder="Amazi Use"
              css={{ marginBottom: '10px' }}
              error={errors.fullName}
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
  email: yup.string().email('Debes proveer un email válido'),
  username: yup.string(),
  fullName: yup.string(),
  password: yup.string(),
});
