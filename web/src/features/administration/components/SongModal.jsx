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

export function SongModal({ isOpen, onClose, shouldValidate }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shouldValidate ? schema : editSchema),
    defaultValues: {
      name: '',
      collab: '',
      isExplicit: false,
    },
  });

  const [isExplicit, setExplicit] = useState(false);

  const handleExplicitChange = () => setExplicit(!isExplicit);

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
              name="name"
              label="Nombre"
              placeholder="Down Horrendous"
              css={{ marginBottom: '10px' }}
              error={errors.name}
              register={register}
            />
            <Field
              type="text"
              name="collab"
              label="Artistas que colaboraron en la canción (si aplica)"
              placeholder="Lady Gaga, Don Omar, etc"
              helperText="Los artistas deben ir separados por comas (,)"
              css={{ marginBottom: '10px' }}
              error={errors.collab}
              register={register}
            />
            {shouldValidate && (
              <Field
                type="file"
                name="song"
                label="Archivo"
                css={{ marginBottom: '10px' }}
                register={register}
              />
            )}
            <Checkbox
              name="isExplicit"
              text="¿Es Explicito?"
              control={control}
              onChangeHandler={handleExplicitChange}
              value={isExplicit}
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
  name: yup.string().required('Este campo es requerido'),
  collab: yup.string(),
  isExplicit: yup.boolean().required('Este campo es requerido'),
});

const editSchema = yup.object({
  name: yup.string(),
  collab: yup.string(),
  isExplicit: yup.boolean(),
});
