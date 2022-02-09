import {
  SimpleGrid,
  Image,
  Box,
  Text,
  Heading,
  PinInput,
  PinInputField,
  HStack,
  VStack,
  useDisclosure,
  ButtonGroup,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BiSearchAlt } from 'react-icons/bi';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';

import { Login } from '../components/Login';

import { Link, Button } from '@/components/Elements';
import { Field, Checkbox } from '@/components/Form';
import { Highlight } from '@/components/Utils';
import { theme } from '@/stitches.config.js';

const BOX_PROPS = {
  borderWidth: '1px',
  borderColor: 'gray',
  borderRadius: '2xl',
  maxWidth: '40%',
  margin: 'auto',
  textAlign: 'center',
};

const HEADING_PROPS = {
  fontSize: '3xl',
  margin: '20px 25px 0 25px',
};

const BUTTON_PROPS = {
  type: 'submit',
  variant: 'accent',
  margin: '25px 0',
  padding: '25px',
};

export function AccountRecovery() {
  const [stepState, setStepState] = useState(undefined);
  const [isArtist, setIsArtist] = useState(false);
  const [verificationCode, setVerificationCode] = useState(0);
  const [entityId, setEntityId] = useState(0);

  const { nextStep, prevStep, _, activeStep } = useSteps({
    initialStep: 0,
  });

  useEffect(() => {
    console.log(isArtist);
  }, [isArtist]);

  return (
    <SimpleGrid>
      <Link to="/">
        <Image
          src="/assets/images/app-icon-transparent.png"
          alt="Ongaku Logo"
          margin="5px auto"
          height="100px"
          maxWidth="150px"
        />
      </Link>

      <VStack>
        <Heading marginTop="10px">
          Recover the <Highlight>access</Highlight> to your account
        </Heading>
        <Text padding="15px" width="40%" fontSize="lg" textAlign="center">
          We&apos;ll walk you through the account recovery process, the only thing you need is{' '}
          <Highlight>access to the email</Highlight> associated with the account.
        </Text>
      </VStack>

      <Steps
        state={stepState}
        activeStep={activeStep}
        padding="30px 20px 50px 30px"
        orientation="horizontal"
      >
        <Step label="Search Email" description="Bear in mind that you have limited attempts">
          <Box {...BOX_PROPS}>
            <FirstStep
              nextStep={nextStep}
              isArtist={isArtist}
              setIsArtist={setIsArtist}
              setVerificationCode={setVerificationCode}
              setEntityId={setEntityId}
            />
          </Box>
        </Step>
        <Step
          label="Enter Verification Code"
          description="If you didn't receive it, wait and try again"
        >
          <Box {...BOX_PROPS}>
            <SecondStep nextStep={nextStep} verificationCode={verificationCode} />
          </Box>
        </Step>
        <Step label="Change Password" description="Start using a password manager bud">
          <Box {...BOX_PROPS}>
            <ThirdStep nextStep={nextStep} isArtist={isArtist} entityId={entityId} />
          </Box>
        </Step>
        <Step label="Done">
          <Box {...BOX_PROPS}>
            <FourthStep />
          </Box>
        </Step>
      </Steps>

      <Box margin="auto" paddingTop="15px">
        <Link to="/" variant="gray">
          Go Back
        </Link>
      </Box>

      <Box margin="auto">
        <Image src="/assets/images/home-footer.png" margin="40px 0 20px 0" />
      </Box>
    </SimpleGrid>
  );
}

function FirstStep({ nextStep, isArtist, setIsArtist, setVerificationCode, setEntityId }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(firstStepSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleIsArtist = () => setIsArtist(!isArtist);

  return (
    <>
      <Heading {...HEADING_PROPS}>First, let&apos;s find your account</Heading>
      <Box padding="15px 60px">
        <Field
          type="text"
          name="email"
          label="Email"
          placeholder="joemama@gmail.com"
          error={errors.email}
          register={register}
        />
        <Checkbox
          name="isArtist"
          text="Are you an artist?"
          control={control}
          onChangeHandler={handleIsArtist}
          value={isArtist}
          marginTop="15px"
        />
        <Button {...BUTTON_PROPS} rightIcon={<BiSearchAlt size={20} />}>
          Search
        </Button>
      </Box>
    </>
  );
}

const firstStepSchema = yup.object({
  email: yup.string().email('You must enter a valid email').required('This field is required.'),
});

function SecondStep({ nextStep, verificationCode }) {
  const [pinValue, setPinValue] = useState('');
  const [error, setError] = useState('');

  const handleCodeVerification = () => {
    if (pinValue === verificationCode) {
      nextStep();
      setError(null);
    } else {
      setError('Wrong code, check your email and try again!');
    }
  };

  return (
    <>
      <Heading {...HEADING_PROPS}>Second, did you receive a code?</Heading>
      <Text margin="20px 0">Input the 6 digit code sent to *****ma@gmail.com</Text>
      <Box padding="0 110px">
        <HStack margin="10px" borderColor={error && theme.colors.dangerSolid.value}>
          <PinInput onChange={(value) => setPinValue(value)} focusBorderColor="pink.500">
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
        {error && <Text color={theme.colors.dangerSolid.value}>{error}</Text>}

        <Button {...BUTTON_PROPS} onClick={handleCodeVerification}>
          Submit
        </Button>
      </Box>
    </>
  );
}

function ThirdStep({ nextStep, isArtist, entityId }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(thirdStepSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  return (
    <>
      <Heading {...HEADING_PROPS}>Third and last, change the password</Heading>
      <Box padding="10px 130px">
        <VStack>
          <Field
            type="text"
            name="password"
            label="Password"
            placeholder="************"
            error={errors.password}
            register={register}
          />
          <Field
            type="text"
            name="passwordConfirmation"
            label="Confirm Password"
            placeholder="************"
            error={errors.passwordConfirmation}
            register={register}
          />
        </VStack>
        <Button {...BUTTON_PROPS} rightIcon={<BiSearchAlt size={20} />}>
          Search
        </Button>
      </Box>
    </>
  );
}

const thirdStepSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Minimum eight (8) characters.')
    .required('This field is required.'),
  passwordConfirmation: yup
    .string()
    .required('This field is required.')
    .oneOf([yup.ref('password'), null], 'Both passwords must match.'),
});

function FourthStep() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Heading {...HEADING_PROPS}>
        <Highlight>Done!</Highlight>
      </Heading>
      <Box padding="10px 5px">
        <Text width="100%" padding="0 20px">
          <Highlight>Welcome back,</Highlight> now you can access and start using Ongaku at
          it&apos;s fullest, start listening to your favorite artists, either by yourself or with
          friends!
        </Text>
        <ButtonGroup spacing="5" margin="20px">
          <Button variant="accent" padding="20px" onClick={onOpen}>
            Log in
          </Button>
          <Button as={RouterLink} to="/" padding="20px">
            Go Home
          </Button>
        </ButtonGroup>
      </Box>

      {isOpen && <Login isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
