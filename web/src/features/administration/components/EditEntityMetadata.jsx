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
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';

import { editUser } from '../api/entities';

import { Button } from '@/components/Elements';
import { Field, Checkbox } from '@/components/Form';
import { useRequest } from '@/hooks';

export function EditEntityMetadata({ isOpen, onClose, metadata }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      active: metadata.active,
      ipAddress: metadata.ipAddress,
      verifiedEmail: metadata.verifiedEmail,
    },
  });

  const [isActive, setActive] = useState(metadata.active);
  const [isEmailVerified, setEmailVerified] = useState(metadata.verifiedEmail);

  const handleActivation = () => setActive(!isActive);
  const handleEmailVerification = () => setEmailVerified(!isEmailVerified);

  const [request, setRequestState] = useRequest();

  const queryClient = useQueryClient();
  const mutation = useMutation(editUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-users');
    },
  });

  const onSubmit = async (data) => {
    const body = new FormData();
    body.append('id', metadata.id);
    body.append('active', data.active);
    body.append('ipAddress', data.ipAddress);
    body.append('verifiedEmail', data.verifiedEmail);
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
              type="text"
              name="ipAddress"
              label="Dirección IP"
              placeholder="192.168.1.1"
              css={{ marginBottom: '10px' }}
              error={errors.ipAddress}
              isDisabled={request.status !== ''}
              register={register}
            />
            <Checkbox
              name="active"
              text="Activo"
              control={control}
              onChangeHandler={handleActivation}
              value={isActive}
              defaultChecked={isActive}
              size="md"
              padding="5px 0"
              isDisabled={request.status !== ''}
              marginRight="20px"
            />
            <Checkbox
              name="verifiedEmail"
              text="Correo Verificado"
              control={control}
              onChangeHandler={handleEmailVerification}
              value={isEmailVerified}
              isDisabled={request.status !== ''}
              defaultChecked={isEmailVerified}
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
  active: yup.boolean(),
  verifiedEmail: yup.boolean(),
  ipAddress: yup.string(),
});
