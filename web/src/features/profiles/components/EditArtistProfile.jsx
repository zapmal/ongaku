import {
  Modal,
  Textarea,
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

export function EditArtistProfile({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      officialWebsite: '',
      biography: '',
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
                name="officialWebsite"
                label="Sitio Oficial"
                placeholder="example-records.net"
                css={{ marginBottom: '10px' }}
                error={errors.officialWebsite}
                register={register}
              />
              <Field
                type="file"
                name="coverImage"
                label="Portada"
                css={{ marginBottom: '10px' }}
                // isDisabled={true}
                // error={errors.cover}
                register={register}
              />
              <Field
                type="file"
                name="avatar"
                label="Avatar"
                css={{ marginBottom: '10px' }}
                // isDisabled={true}
                // error={errors.cover}
                register={register}
              />
              <Text fontWeight="bold" fontSize="sm" margin="10px 3px 15px">
                Biografía
              </Text>
              <Textarea
                name="biography"
                placeholder="Biografía"
                resize="none"
                marginBottom="10px"
                {...register('biography')}
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
  officialWebsite: yup.string().url('Debes proveer una URL válida'),
  biography: yup.string(),
});
