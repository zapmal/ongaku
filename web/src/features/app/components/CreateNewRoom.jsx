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
      visibility: '',
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
              <Heading fontSize="xl">Create a Room</Heading>
              <Text fontSize="sm" color="whiteAlpha.700" marginTop="10px">
                Fill the following fields to start a new room.
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Field
                type="text"
                name="name"
                label="Room Name"
                placeholder="Joe's Room"
                error={errors.name}
                register={register}
              />
              <Field
                type="number"
                name="limit"
                label="Room Limit"
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
                Genres
              </Text>
              <Select
                control={control}
                options={[...MUSIC_GENRES]}
                name="genres"
                placeholder="Select genres"
                error={errors.genres}
                onChangeCallback={(value) => value.map((v) => v.value)}
                isMulti
              />
              {errors.genres && (
                <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
                  {errors.genres.message}
                </Text>
              )}

              <Text
                textAlign="left"
                marginTop="10px"
                paddingBottom="10px"
                paddingLeft="5px"
                fontWeight="bold"
              >
                Visibility
              </Text>
              <Select
                control={control}
                options={[
                  { label: 'Public', value: 'public' },
                  { label: 'Private', value: 'private' },
                ]}
                name="visibility"
                placeholder="Visibility of the Room"
                error={errors.visibility}
                onChangeCallback={(value) => value.value}
              />
              {errors.visibility && (
                <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
                  {errors.visibility.message}
                </Text>
              )}
            </ModalBody>
            <ModalFooter margin="0 auto">
              <Button variant="accent" type="submit">
                Create
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
  name: yup.string().required('This field is required.'),
  limit: yup
    .number()
    .min(1, 'The limit must be greater than 1.')
    .max(5, 'The limit can not go beyond 5 at the moment.')
    .required('This field is required.'),
  genres: yup
    .array()
    .min(1, 'You must select at least one genre.')
    .required('This field is required.'),
  visibility: yup.string().required('This field is required.'),
});
