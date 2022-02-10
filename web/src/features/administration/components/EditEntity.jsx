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

export function EditEntity({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      username: '',
      fullName: '',
      password: '',
      birthdate: '',
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
              type="email"
              name="email"
              label="Email"
              placeholder="theuser@gmail.com"
              css={{ marginBottom: '10px' }}
              error={errors.email}
              register={register}
            />
            <Field
              type="text"
              name="username"
              label="Username"
              placeholder="Amazi_ngUser_11"
              css={{ marginBottom: '10px' }}
              error={errors.username}
              register={register}
            />
            <Field
              type="text"
              name="fullName"
              label="Full Name"
              placeholder="Amazi Use"
              css={{ marginBottom: '10px' }}
              error={errors.fullName}
              register={register}
            />
            <Field
              type="password"
              name="password"
              label="Password"
              placeholder="*********"
              css={{ marginBottom: '10px' }}
              error={errors.password}
              register={register}
            />
            <Field
              type="date"
              name="birthdate"
              label="Birthdate"
              css={{ marginBottom: '10px' }}
              error={errors.birthdate}
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
  email: yup.string().email('You must provide a valid email.'),
  username: yup.string(),
  fullName: yup.string(),
  password: yup.string(),
  birthdate: yup.string(),
});
