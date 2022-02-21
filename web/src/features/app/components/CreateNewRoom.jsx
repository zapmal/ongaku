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
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button } from '@/components/Elements';
import { Field, Select } from '@/components/Form';
import { MUSIC_GENRES } from '@/features/auth';
import { theme } from '@/stitches.config.js';

export function CreateNewRoom({ isOpen, onClose }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      limit: 0,
      genres: [],
    },
  });

  const onSubmit = () => console.log('AY YO');

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
              <Heading fontSize="xl">Crea una Sala</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Field
                type="text"
                name="name"
                label="Nombre de la Sala"
                placeholder="Joe's Room"
                error={errors.name}
                register={register}
              />
              <Field
                type="number"
                name="limit"
                label="Límite"
                placeholder="1, 3, 5"
                error={errors.limit}
                register={register}
              />
              <Text
                textAlign="left"
                marginTop="10px"
                paddingBottom="10px"
                paddingLeft="5px"
                fontWeight="bold"
              >
                Géneros
              </Text>
              <Select
                control={control}
                options={[...MUSIC_GENRES]}
                name="genres"
                placeholder="Hip-Hop, Rap, etc"
                error={errors.genres}
                onChangeCallback={(value) => value.map((v) => v.value)}
                isMulti
              />
              {errors.genres && (
                <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
                  {errors.genres.message}
                </Text>
              )}
            </ModalBody>
            <ModalFooter margin="0 auto">
              <Button variant="accent" type="submit">
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
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

const schema = yup.object({
  name: yup.string().required('Este campo es requerido'),
  limit: yup
    .number()
    .min(1, 'El límite debe ser mayor que uno (1)')
    .max(5, 'El límite no puede ser más de cinco (5)')
    .required('Este campo es requerido'),
  genres: yup
    .array()
    .min(1, 'Debes seleccionar al menos un género')
    .required('Este campo es requerido'),
});
