import {
  Textarea,
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
import { theme } from '@/stitches.config.js';

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
      length: '',
      lyrics: '',
      isExplicit: false,
      verifiedEmail: false,
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
              label="Name"
              placeholder="Down Horrendous"
              css={{ marginBottom: '10px' }}
              error={errors.name}
              register={register}
            />
            <Field
              type="text"
              name="length"
              label="Length (m:ss)"
              placeholder="3:14, 1:15"
              css={{ marginBottom: '10px' }}
              error={errors.length}
              register={register}
            />
            <Text fontWeight="bold" fontSize="sm" margin="10px 3px 15px">
              Lyrics
            </Text>
            <Textarea
              name="lyrics"
              placeholder="Biography"
              resize="none"
              marginBottom="10px"
              borderColor={errors.lyrics && theme.colors.dangerSolid.value}
              _hover={{
                borderColor: theme.colors.accentSolid.value,
              }}
              focusBorderColor={theme.colors.accentSolid.value}
              {...register('lyrics')}
            />
            {errors.lyrics && (
              <Text marginBottom="10px" color={theme.colors.dangerSolid.value}>
                {errors.lyrics.message}
              </Text>
            )}
            <Checkbox
              name="verifiedEmail"
              text="Verified Email"
              control={control}
              onChangeHandler={handleExplicitChange}
              value={isExplicit}
              size="md"
              padding="5px 0"
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
  length: yup.string().required('This field is required.'),
  lyrics: yup.string().required('This field is required.'),
  isExplicit: yup.boolean().required('This field is required.'),
});

const editSchema = yup.object({
  name: yup.string(),
  length: yup.string(),
  lyrics: yup.string(),
  isExplicit: yup.boolean(),
});
