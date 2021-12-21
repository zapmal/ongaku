import { Wrap, WrapItem, Box, Text, Center, Checkbox } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

import { responsivePaddings, MUSIC_GENRES, COUNTRIES } from '../../constants';

import { Button, Link } from '@/components/Elements';
import { Field, Select } from '@/components/Form';
import { theme } from '@/stitches.config.js';

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
  const [isBand, setIsBand] = useState(false);

  // Do the request here.
  // We need extra validation for the multi-value fields, if we don't detect comma-separated
  // or space separated values then we'll thrown an error and explain it throughly.
  const onSubmit = (data) => {
    const allData = {
      ...basicData,
      ...data,
    };

    console.log(allData);
    // nextStep();
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
              error={errors.labels}
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
                register={register}
              />
            ) : (
              <Field
                type="text"
                name="artisticName"
                label="Artistic Name"
                placeholder="Lil xxxJoemama"
                error={errors.artisticName}
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
              placeholder="Joe Mama, Carl Johnson"
              error={errors.members}
              isDisabled={!isBand}
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
          >
            Is it a band?
          </Checkbox>
        )}
      />
      <Center marginTop="40px">
        <Button onClick={prevStep} margin="0 30px">
          Go Back
        </Button>
        <Button type="submit" align="center" variant="accent">
          Submit
        </Button>
      </Center>
      <Text color={theme.colors.primaryText.value} padding="5px" marginLeft="30px">
        or
      </Text>
      <Link to="/login" variant="gray" marginLeft="30px">
        Login
      </Link>
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
