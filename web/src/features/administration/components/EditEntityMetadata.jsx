import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button } from '@/components/Elements';
import { Field, Checkbox } from '@/components/Form';

export function EditEntityMetadata({ isOpen, onClose }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      active: '',
      ipAddress: '',
      verifiedEmail: '',
    },
  });

  // default value should come from api
  const [isActive, setActive] = useState(false);
  const [isEmailVerified, setEmailVerified] = useState(false);

  const handleActivation = () => setActive(!isActive);
  const handleEmailVerification = () => setEmailVerified(!isEmailVerified);

  const onSubmit = (data) => console.log(data);

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
              register={register}
            />
            <Checkbox
              name="active"
              text="Activo"
              control={control}
              onChangeHandler={handleActivation}
              value={isActive}
              size="md"
              padding="5px 0"
              marginRight="20px"
            />
            <Checkbox
              name="verifiedEmail"
              text="Correo Verificado"
              control={control}
              onChangeHandler={handleEmailVerification}
              value={isEmailVerified}
              size="md"
              padding="5px 0"
            />
          </ModalBody>
          <ModalFooter margin="0 auto">
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
