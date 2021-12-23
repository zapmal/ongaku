import { Wrap, WrapItem, Box, Text, Center, Checkbox, Spinner } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

import { registerArtist } from '../../api/register';
import { responsivePaddings, MUSIC_GENRES, COUNTRIES } from '../../constants';

import { Button, Link } from '@/components/Elements';
import { Field, Select } from '@/components/Form';
import { useSubmissionState } from '@/hooks/useSubmissionState';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

export function SecondStep({ nextStep, prevStep, setStepState, basicData }) {
  const {
    register,
    control,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(secondStepSchema),
    defaultValues: {
      country: '',
      genres: [],
      labels: '',
      yearsActive: 0,
      isBand: false,
      artisticName: '',
      bandName: '',
      members: '',
    },
  });
  const [submission, setSubmissionState] = useSubmissionState();
  const setEntity = useAuthStore((s) => s.setEntity);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [isBand, setIsBand] = useState(false);

  const onSubmit = async (data) => {
    const { members, labels, isBand, bandName, ...artistData } = data;
    const conditionalData = isBand
      ? {
          members: members.split(','),
          labels: labels.split(','),
          bandName,
        }
      : {
          labels: labels.split(','),
        };

    try {
      setSubmissionState((prevState) => ({ ...prevState, isSubmitting: true }));

      const response = await registerArtist({
        ...artistData,
        ...basicData,
        ...conditionalData,
        isBand,
      });

      setSubmissionState({ status: 'success', isSubmitting: false });
      setEntity(response.artist);

      nextStep();
    } catch (error) {
      // An object is being rendered on error
      setSubmissionState({
        status: 'error',
        isSubmitting: false,
      });

      if (error.message === 'canceled') {
        addNotification({
          title: 'Error',
          message: 'We could not process your request, try again later',
          status: 'error',
        });
      } else {
        addNotification({
          title: 'Error',
          message: error,
          status: 'error',
        });
      }
    }
  };

  const handleIsBand = () => {
    if (isBand) {
      resetField('members');
      resetField('bandName');
    } else {
      resetField('artisticName');
    }

    setIsBand(!isBand);
  };

  useEffect(() => {
    if (errors && Object.keys(errors).length !== 0) {
      setStepState('error');
    } else {
      setStepState(undefined);
    }
  }, [errors, setStepState]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Wrap>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box width="200px" marginRight="5px">
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
              isDisabled={submission.status != ''}
            />
            {errors.genres && (
              <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
                {errors.genres.message}
              </Text>
            )}
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            <Field
              type="text"
              name="labels"
              label="Label(s)"
              placeholder="JM Records, Hybe"
              helperText="Labels must be divided by commas."
              error={errors.labels}
              isDisabled={submission.status != ''}
              register={register}
            />
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box maxWidth="205px">
            <Field
              type="number"
              name="yearsActive"
              label="Years Active"
              placeholder="13"
              error={errors.yearsActive}
              isDisabled={submission.status != ''}
              register={register}
            />
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            {isBand ? (
              <Field
                type="text"
                name="bandName"
                label="Band Name"
                placeholder="Joe n' the Mamas"
                error={errors.bandName}
                isDisabled={submission.status != ''}
                register={register}
              />
            ) : (
              <Field
                type="text"
                name="artisticName"
                label="Artistic Name"
                placeholder="Lil xxxJoemama"
                error={errors.artisticName}
                isDisabled={submission.status != ''}
                register={register}
              />
            )}
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box width="200px" maxWidth="300px" marginRight="5px">
            <Text
              textAlign="left"
              marginTop="10px"
              paddingBottom="10px"
              paddingLeft="5px"
              fontWeight="bold"
            >
              Country
            </Text>
            <Select
              control={control}
              options={[...COUNTRIES]}
              name="country"
              placeholder="Select a country"
              error={errors.country}
              isDisabled={submission.status != ''}
              onChangeCallback={(value) => value.value}
            />
            {errors.country && (
              <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
                {errors.country.message}
              </Text>
            )}
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            <Field
              type="text"
              name="members"
              label="Members"
              helperText="Members must be divided by commas."
              placeholder="Joe Mama, Carl Johnson"
              error={errors.members}
              isDisabled={!isBand || submission.status != ''}
              register={register}
            />
          </Box>
        </WrapItem>
      </Wrap>
      <Controller
        control={control}
        name="isBand"
        render={({ field }) => (
          <Checkbox
            onChange={(v) => {
              field.onChange(v);
              handleIsBand();
            }}
            checked={isBand}
            colorScheme="pink"
            size="lg"
            marginTop="30px"
            marginLeft="30px"
            isDisabled={submission.status != ''}
          >
            Is it a band?
          </Checkbox>
        )}
      />
      {submission.isSubmitting ? (
        <Center marginTop="40px">
          <Spinner size="lg" />
        </Center>
      ) : (
        <>
          <Center marginTop="40px">
            <Button onClick={prevStep} margin="0 30px" isDisabled={submission.status != ''}>
              Go Back
            </Button>
            <Button
              type="submit"
              align="center"
              variant="accent"
              isDisabled={submission.status != ''}
            >
              Submit
            </Button>
          </Center>
          <Text color={theme.colors.primaryText.value} padding="5px" marginLeft="30px">
            or
          </Text>
          <Link to="/login" variant="gray" marginLeft="30px">
            Login
          </Link>
        </>
      )}
    </form>
  );
}

const secondStepSchema = yup.object({
  country: yup.string().required('This field is required.'),
  genres: yup
    .array()
    .min(1, 'You must select at least one genre.')
    .required('This field is required.'),
  labels: yup.string().required('This field is required.'),
  yearsActive: yup
    .number()
    .transform((parsedValue, originalValue) => (originalValue === '' ? undefined : parsedValue))
    .required('This field is required.')
    .positive('You must enter a positive number.')
    .integer('You must enter a whole number.'),
  isBand: yup.boolean(),
  artisticName: yup.string().when('isBand', {
    is: false,
    then: yup.string().required('This field is required.'),
  }),
  bandName: yup.string().when('isBand', {
    is: true,
    then: yup.string().required('This field is required.'),
  }),
  members: yup.string().when('isBand', {
    is: true,
    then: yup.string().required('This field is required.'),
  }),
});
