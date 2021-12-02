import { SimpleGrid, Image, Center, Wrap, WrapItem, Box, Text, Heading } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { MUSIC_GENRES, COUNTRIES } from '../constants';
import { NavigationBar } from '../styles';

import { Link, Field, Button, Select } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

const labels = ['Basic Information', 'Artist Information', 'End'];
const responsivePaddings = ['25%', '30%', '15%', '20%', '11%'];

export function ArtistRegister() {
  const [stepState, setStepState] = useState(undefined);

  // eslint-disable-next-line no-unused-vars
  const { nextStep, prevStep, _, activeStep } = useSteps({
    initialStep: 1,
  });

  return (
    <SimpleGrid columns={[1, 1, 1, 1, 2]}>
      <div>
        <NavigationBar>
          <Image src="/assets/images/logo-transparent.png" alt="Ongaku Logo" />
          <Link to="/register" variant="gray" margin="50px 50px 0 0">
            Go Back
          </Link>
        </NavigationBar>

        <Box textAlign="center" align="center">
          <Heading paddingTop="10px">You&apos;re almost part of our team</Heading>
          <Text color={theme.colors.accentSolid.value} paddingTop="10px" fontSize="xl">
            Tell us about you.
          </Text>
        </Box>

        <Steps
          state={stepState}
          activeStep={activeStep}
          colorScheme="pink"
          padding="30px 40px"
          orientation="vertical"
          responsive={false}
        >
          <Step key={labels[0]} label={labels[0]}>
            <FirstStep nextStep={nextStep} setStepState={setStepState} />
          </Step>
          <Step key={labels[1]} label={labels[1]}>
            <SecondStep nextStep={nextStep} prevStep={prevStep} setStepState={setStepState} />
          </Step>
          <Step key={labels[2]} label={labels[2]}>
            <p>culo</p>
          </Step>
        </Steps>
      </div>

      <Image
        src="/assets/images/dahyun-twice.webp"
        alt="Dahyun, rapper and vocalist of korean group Twice"
        height="100%"
        display={['none', 'none', 'none', 'none', 'inline']}
        fallbackSrc="https://via.placeholder.com/1080"
      />
    </SimpleGrid>
  );
}

const firstStepSchema = yup.object({
  email: yup.string().email('You must enter a valid email.').required('This field is required.'),
  birthdate: yup.string().required('This field is required.'),
  password: yup
    .string()
    .min(8, 'Minimum eight (8) characters.')
    .required('This field is required.'),
  passwordConfirmation: yup
    .string()
    .required('This field is required.')
    .oneOf([yup.ref('password'), null], 'Both passwords must match.'),
});

function FirstStep({ nextStep, setStepState }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(firstStepSchema),
    defaultValues: {
      email: '',
      birthdate: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  useEffect(() => {
    if (errors && Object.keys(errors).length !== 0) {
      setStepState('error');
    } else {
      setStepState(undefined);
    }
  }, [errors, setStepState]);

  /**
   * Here, not only the nextStep() can be executed, the form data
   * can be persisted on a store through Zustand hooks in case of need.
   */
  const onSubmit = (data) => {
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Wrap textAlign="left">
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            <Field
              type="email"
              name="email"
              label="Email"
              placeholder="joemama@gmail.com"
              error={errors.email}
              register={register}
            />
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            <Field
              type="date"
              name="birthdate"
              label="Birthdate"
              css={`
                ::-webkit-calendar-picker-indicator {
                  filter: invert(1);
                }
              `}
              error={errors.birthdate}
              register={register}
            />
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            <Field
              type="password"
              name="password"
              label="Password"
              placeholder="********"
              error={errors.password}
              register={register}
            />
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            <Field
              type="password"
              name="passwordConfirmation"
              label="Password Confirmation"
              placeholder="********"
              error={errors.passwordConfirmation}
              register={register}
            />
          </Box>
        </WrapItem>
      </Wrap>
      <Center>
        <Button type="submit" variant="accent" margin="40px 0">
          Next
        </Button>
      </Center>
    </form>
  );
}

const secondStepSchema = yup.object({
  country: yup.string().required('This field is required.'),
  musicGenres: yup
    .array()
    .min(1, 'You must select at least one genre.')
    .required('This field is required.'),
});

const SecondStep = ({ nextStep, prevStep, setStepState }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(secondStepSchema),
  });

  const onSubmit = (data) => {
    console.log('data', data);
    nextStep();
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
        <WrapItem>
          <Box width="200px">
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
      </Wrap>
      <Wrap>
        <WrapItem>
          <Box width="200px" maxWidth="300px">
            <Select
              control={control}
              options={[...MUSIC_GENRES]}
              name="musicGenres"
              placeholder="Select genres"
              error={errors.musicGenres}
              onChangeCallback={(value) => value.map((v) => v.value)}
              isMulti
            />
            {errors.musicGenres && (
              <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
                {errors.musicGenres.message}
              </Text>
            )}
          </Box>
        </WrapItem>
      </Wrap>
      <Center>
        <Button type="submit" align="center" variant="accent" marginTop="40px">
          Submit
        </Button>
        <Button onClick={prevStep}>Go Back</Button>
      </Center>
    </form>
  );
};
