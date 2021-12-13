import {
  SimpleGrid,
  Image,
  Center,
  Wrap,
  WrapItem,
  Box,
  Text,
  Heading,
  Checkbox,
  Divider,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';

import { Footer } from '../components/Footer';
import { MUSIC_GENRES, COUNTRIES } from '../constants';
import { NavigationBar } from '../styles';

import { Link, Field, Button, Select, Highlight } from '@/components/Elements';
import { theme } from '@/stitches.config.js';
import { useArtistStore } from '@/stores/useArtistStore';

const labels = ['Basic Information', 'Artistic Information', 'End'];
const responsivePaddings = ['25%', '30%', '15%', '20%', '9%'];

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
          <Image src="/assets/images/app-icon-transparent.png" alt="Ongaku Logo" />
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
            <ThirdStep />
          </Step>
        </Steps>

        <Footer />
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
  const setBasicInformation = useArtistStore((s) => s.setBasicInformation);

  useEffect(() => {
    if (errors && Object.keys(errors).length !== 0) {
      setStepState('error');
    } else {
      setStepState(undefined);
    }
  }, [errors, setStepState]);

  const onSubmit = (data) => {
    console.log(data);
    setBasicInformation(data);
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
                  background: url(https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/calendar-16.png)
                    center/80% no-repeat;
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

const SecondStep = ({ nextStep, prevStep, setStepState }) => {
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
      musicGenres: [],
      labels: '',
      yearsActive: 0,
      bandFlag: false,
      artisticName: '',
      bandName: '',
      members: '',
    },
  });
  const [bandFlag, setBandFlag] = useState(false);
  const setArtisticInformation = useArtistStore((s) => s.setArtisticInformation);

  // Do the request here.
  // We need extra validation for the multi-value fields, if we don't detect comma-separated
  // or space separated values then we'll thrown an error and explain it throughly.
  const onSubmit = (data) => {
    console.log('data', data);
    setArtisticInformation(data);
    nextStep();
  };

  const handleBandFlagChange = () => {
    if (bandFlag) {
      resetField('members');
      resetField('bandName');
    } else {
      resetField('artisticName');
    }

    setBandFlag(!bandFlag);
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
            {bandFlag ? (
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
              isDisabled={!bandFlag}
              register={register}
            />
          </Box>
        </WrapItem>
      </Wrap>
      <Controller
        control={control}
        name="bandFlag"
        render={({ field }) => (
          <Checkbox
            onChange={(v) => {
              field.onChange(v);
              handleBandFlagChange();
            }}
            checked={bandFlag}
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
};

const secondStepSchema = yup.object({
  country: yup.string().required('This field is required.'),
  musicGenres: yup
    .array()
    .min(1, 'You must select at least one genre.')
    .required('This field is required.'),
  labels: yup.string().required('This field is required.'),
  yearsActive: yup
    .number()
    .required('This field is required.')
    .positive('You must enter a positive number.')
    .integer('You must enter a whole number.'),
  bandFlag: yup.boolean(),
  artisticName: yup.string().when('bandFlag', {
    is: false,
    then: yup.string().required('This field is required.'),
  }),
  bandName: yup.string().when('bandFlag', {
    is: true,
    then: yup.string().required('This field is required.'),
  }),
  members: yup.string().when('bandFlag', {
    is: true,
    then: yup.string().required('This field is required.'),
  }),
});

const ThirdStep = () => {
  return (
    <div>
      <Box textAlign="left">
        <Heading size="lg" paddingTop="10px">
          Registration finished!
        </Heading>
        <Text padding="20px">
          You should check your <Highlight>email inbox</Highlight> and complete the final step, the
          confirmation, so that {"you'll"} be able to start publishing and managing your work here
          on Ongaku!
        </Text>
        <Button marginLeft="20px" as={RouterLink} to={'/home'}>
          Go Home
        </Button>
      </Box>
      <Divider padding="10px" width="90%" />
    </div>
  );
};
