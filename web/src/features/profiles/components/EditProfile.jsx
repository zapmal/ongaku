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
                label="Name"
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
                label="Password"
                css={{ marginBottom: '10px' }}
                error={errors.password}
                register={register}
              />
              <Field
                type="password"
                name="passwordConfirmation"
                placeholder="*********"
                label="Password Confirmation"
                css={{ marginBottom: '10px' }}
                error={errors.passwordConfirmation}
                register={register}
              />
              <Field
                type="file"
                name="profilePicture"
                label="Profile Picture"
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
    </>
  );
}

const schema = yup.object({
  fullName: yup.string().required('This field is required.'),
  password: yup
    .string()
    .min(8, 'Minimum eight (8) characters.')
    .required('This field is required.'),
  passwordConfirmation: yup
    .string()
    .required('This field is required.')
    .oneOf([yup.ref('password'), null], 'Both passwords must match.'),
  email: yup.string().email('You must enter a valid email.').required('This field is required.'),
});
