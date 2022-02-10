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
                label="Official Website"
                placeholder="example-records.net"
                css={{ marginBottom: '10px' }}
                error={errors.officialWebsite}
                register={register}
              />
              <Field
                type="file"
                name="coverImage"
                label="Cover Image"
                css={{ marginBottom: '10px' }}
                // isDisabled={true}
                // error={errors.cover}
                register={register}
              />
              <Field
                type="file"
                name="biographyImage"
                label="Biography Image"
                css={{ marginBottom: '10px' }}
                // isDisabled={true}
                // error={errors.cover}
                register={register}
              />
              <Text fontWeight="bold" fontSize="sm" margin="10px 3px 15px">
                Biography
              </Text>
              <Textarea
                name="biography"
                placeholder="Biography"
                resize="none"
                marginBottom="10px"
                {...register('biography')}
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
  officialWebsite: yup.string().url('You must provide a valid url.'),
  biography: yup.string(),
});
