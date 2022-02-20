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
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button } from '@/components/Elements';
import { Field } from '@/components/Form';

export function EditProfile({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = (data) => console.log(data);

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
                name="fullName"
                label="Nombre"
                placeholder="Nick Powers"
                css={{ marginBottom: '10px' }}
                error={errors.fullName}
                register={register}
              />
              <Field
                type="email"
                name="email"
                label="Email"
                placeholder="nick@powers.com"
                css={{ marginBottom: '10px' }}
                error={errors.email}
                register={register}
              />
              <Field
                type="password"
                name="password"
                placeholder="*********"
                label="Contraseña"
                css={{ marginBottom: '10px' }}
                error={errors.password}
                register={register}
              />
              <Field
                type="password"
                name="passwordConfirmation"
                placeholder="*********"
                label="Confirmación de Contraseña"
                css={{ marginBottom: '10px' }}
                error={errors.passwordConfirmation}
                register={register}
              />
              <Field
                type="file"
                name="profilePicture"
                label="Foto de Perfil"
                // isDisabled={true}
                // error={errors.cover}
                register={register}
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
    </>
  );
}

const schema = yup.object({
  fullName: yup.string().required('Este campo es requerido'),
  password: yup.string().min(8, 'Mínimo ocho (8) carácteres').required('Este campo es requerido'),
  passwordConfirmation: yup
    .string()
    .required('Este campo es requerido')
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir'),
  email: yup.string().email('Debes ingresar un correo válido').required('Este campo es requerido'),
});
