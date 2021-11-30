import {
  SimpleGrid,
  Image,
  Center,
  Wrap,
  WrapItem,
  Box,
  Text,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { Select } from "@chakra-ui/react"
import { yupResolver } from '@hookform/resolvers/yup';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Header } from '../styles';
import { MUSIC_GENRES } from '../constants'

import { Link, Field, Button } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

const schema = yup.object({
  fullname: yup.array().required('This field is required.'),
});

export function ArtistRegister() {
  const [artistInfo, setArtistInfo] = useState({
    email: '',
    birthdate: '',
    password: '',
    passwordConfirmation: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    birthdate: '',
    password: '',
    passwordConfirmation: '',
  });
  const [stepState, setStepState] = useState(undefined);

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const labels = ['Account Information', 'Artist Information'];

  const responsivePaddings = ['25%', '30%', '15%', '20%', '11%'];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: [],
    },
  });

  const onSubmit = (data) => {
    console.log("a", artistInfo, data);
    if (!Object.values(validationErrors).every((prop) => prop === null)) {
      alert("cachuo");
    }
  };

  const validateEmail = (email) => {
    const emailValidationRegex =
      /[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return emailValidationRegex.test(email);
  };

  const validateFields = () => {
    const isValidEmail = validateEmail(artistInfo.email);

    if (isValidEmail) {
      setValidationErrors((prevState) => ({
        ...prevState,
        email: null,
      }));
    } else {
      setValidationErrors((prevState) => ({
        ...prevState,
        email: 'You must enter a valid email',
      }));
    }

    if (artistInfo.birthdate) {
      setValidationErrors((prevState) => ({
        ...prevState,
        birthdate: null,
      }));
    } else {
      setValidationErrors((prevState) => ({
        ...prevState,
        birthdate: 'This field is required',
      }));
    }

    if (artistInfo.password && artistInfo.password.length < 8) {
      setValidationErrors((prevState) => ({
        ...prevState,
        password: 'Minimum eight (8) characters.',
      }));
    } else if (!artistInfo.password) {
      setValidationErrors((prevState) => ({
        ...prevState,
        password: 'This field is required',
      }));
    } else {
      setValidationErrors((prevState) => ({
        ...prevState,
        password: null,
      }));
    }

    if (!artistInfo.passwordConfirmation) {
      setValidationErrors((prevState) => ({
        ...prevState,
        passwordConfirmation: 'This field is required',
      }));
    } else if (artistInfo.password === artistInfo.passwordConfirmation) {
      setValidationErrors((prevState) => ({
        ...prevState,
        passwordConfirmation: null,
      }));
    } else {
      setValidationErrors((prevState) => ({
        ...prevState,
        passwordConfirmation: 'Both passwords must match',
      }));
    }

    if (Object.values(validationErrors).every((prop) => prop === null)) {
      nextStep();
      }
      //console.log(validationErrors, artistInfo, Object.values(validationErrors));
      
    //nextStep();
  };

  const sendData = (e) => {
    e.preventDefault();
    console.log(artistInfo);
  };

  return (
    <SimpleGrid columns={[1, 1, 1, 1, 2]}>
      <div>
        <Header>
          <Image src="/assets/images/logo-transparent.png" alt="Ongaku Logo" />
          <Link to="/" variant="gray" margin="50px 50px 0 0">
            Go Back
          </Link>
        </Header>
        <Box textAlign="center" align="center">
          <Heading>You&apos;re almost part of our team</Heading>
          <Text color={theme.colors.accentSolid.value} paddingTop="10px" fontSize="xl">
            Tell us about you.
          </Text>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Steps
            state={stepState}
            activeStep={activeStep}
            colorScheme="pink"
            padding="30px 40px"
            responsive={false}
          >
            <Step key={labels[0]}>
              <Wrap textAlign="left">
                <WrapItem paddingLeft={responsivePaddings}>
                  <Box>
                    <Field
                      type="text"
                      name="email"
                      value={artistInfo.email}
                      label="Email"
                      placeholder="joemama@gmail.com"
                      error={validationErrors.email}
                      register={register}
                      onChange={(e) => {
                        console.log("antes", artistInfo);
                        setArtistInfo((prevState) => ({ ...prevState, email: e.target.value }));
                        console.log("despues", artistInfo);
                      }
                      }
                    />
                    {validationErrors.email ? (
                      <Text color={theme.colors.dangerSolid.value}>{validationErrors.email}</Text>
                    ) : null}
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
                      error={validationErrors.birthdate}
                      register={register}
                      onChange={(e) => {
                        setArtistInfo((prevState) => ({ ...prevState, birthdate: e.target.value }));
                        forceUpdate();
                      }
                      }
                    />
                    {validationErrors.birthdate ? (
                      <Text color={theme.colors.dangerSolid.value}>
                        {validationErrors.birthdate}
                      </Text>
                    ) : null}
                  </Box>
                </WrapItem>
                <WrapItem paddingLeft={responsivePaddings}>
                  <Box>
                    <Field
                      type="password"
                      name="password"
                      label="Password"
                      placeholder="********"
                      error={validationErrors.password}
                      register={register}
                      onChange={(e) => {
                        setArtistInfo((prevState) => ({ ...prevState, password: e.target.value }));
                        forceUpdate();
                      }
                      }
                    />
                    {validationErrors.password ? (
                      <Text color={theme.colors.dangerSolid.value}>
                        {validationErrors.password}
                      </Text>
                    ) : null}
                  </Box>
                </WrapItem>
                <WrapItem paddingLeft={responsivePaddings}>
                  <Box>
                    <Field
                      type="password"
                      name="passwordConfirmation"
                      label="Password Confirmation"
                      placeholder="********"
                      error={validationErrors.passwordConfirmation}
                      register={register}
                      onChange={(e) => {
                        setArtistInfo((prevState) => ({
                          ...prevState,
                          passwordConfirmation: e.target.value,
                        }));
                        forceUpdate();
                      }
                      }
                    />
                    {validationErrors.passwordConfirmation ? (
                      <Text color={theme.colors.dangerSolid.value}>
                        {validationErrors.passwordConfirmation}
                      </Text>
                    ) : null}
                  </Box>
                </WrapItem>
              </Wrap>
              <Center>
                <Button onClick={validateFields} variant="accent" margin="40px 0">
                  Next
                </Button>
              </Center>
            </Step>
            <Step key={labels[1]}>
              <Wrap>
                <WrapItem paddingLeft={responsivePaddings}>
                  <Box>
                    <Select
                      onChange={() => console.log("culo")}
                      {...register('fullname')}
                    >
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </Select>
                  </Box>
                </WrapItem>
              </Wrap>
              <Center>
                <Button type="submit" align="center" variant="accent" marginTop="40px">
                  Submit
                </Button>
                <Button onClick={prevStep}>a</Button>
              </Center>
            </Step>
            <Step>
              <p>culo</p>
            </Step>
          </Steps>
        </form>
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
