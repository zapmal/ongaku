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

export function AlbumModal({ isOpen, onClose, shouldValidate }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shouldValidate ? schema : editSchema),
    defaultValues: {
      name: '',
      year: '',
      releaseType: '',
    },
  });

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
              label="Name"
              placeholder="The Og Album"
              css={{ marginBottom: '10px' }}
              error={errors.name}
              register={register}
            />
            <Field
              type="number"
              name="year"
              label="Year"
              placeholder="2014, 2013, 2002"
              css={{ marginBottom: '10px' }}
              error={errors.year}
              register={register}
            />
            <Field
              type="text"
              name="releaseType"
              label="Release Type"
              placeholder="EP, Single, Album"
              css={{ marginBottom: '10px' }}
              error={errors.releaseType}
              register={register}
            />
            <Field
              type="file"
              name="cover"
              label="Cover"
              css={{ marginBottom: '10px' }}
              register={register}
            />
          </ModalBody>
          <ModalFooter margin="0 auto">
            <Button variant="accent" type="submit">
              Change
            </Button>
            <Text
              textDecoration="underline"
              fontSize="sm"
              color="whiteAlpha.700"
              margin="0 20px"
              onClick={onClose}
              _hover={{ cursor: 'pointer' }}
            >
              Cancel
            </Text>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

const schema = yup.object({
  name: yup.string().required('This field is required.'),
  year: yup.string().required('This field is required.'),
  releaseType: yup.string().required('This field is required.'),
});

const editSchema = yup.object({
  name: yup.string(),
  year: yup.string(),
  releaseType: yup.string(),
});
