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
  Spinner,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BiSearchAlt } from 'react-icons/bi';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';

import { sendRecoveryCode, changePassword } from '../api/recovery';
import { Login } from '../components/Login';

import { Footer } from '@/components/Core';
import { Link, Button } from '@/components/Elements';
import { Field, Checkbox } from '@/components/Form';
import { Highlight } from '@/components/Utils';
import { useSubmissionState } from '@/hooks/useSubmissionState';
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

  const { nextStep, activeStep } = useSteps({
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

      <Footer topMargin="25px" />
    </SimpleGrid>
  );
}

function FirstStep({ nextStep, isArtist, setIsArtist, setVerificationCode, setEntityId }) {
  const [submission, setSubmissionState] = useSubmissionState();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(firstStepSchema),
    defaultValues: {
      email: '',
      isArtist: false,
    },
  });

  const handleIsArtist = () => setIsArtist(!isArtist);

  const onSubmit = async (data) => {
    try {
      setSubmissionState({ isSubmitting: true });

      const response = await sendRecoveryCode(data);

      setVerificationCode(response.code);
      setEntityId(response.entityId);
      console.log(response.code, response.entityId);

      setSubmissionState({
        status: 'success',
        isSubmitting: false,
        title: 'Success!',
        message: `${response.message}`,
      });

      setTimeout(() => nextStep(), 3000);
    } catch (error) {
      setSubmissionState({
        status: 'error',
        isSubmitting: false,
        title: 'Error',
        message: error,
      });
    }
  };

  return (
    <>
      <Heading {...HEADING_PROPS}>First, let&apos;s find your account</Heading>
      <Box padding="15px 60px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            type="text"
            name="email"
            label="Email"
            placeholder="joemama@gmail.com"
            error={errors.email}
            isDisabled={submission.status != ''}
            register={register}
          />
          <Checkbox
            name="isArtist"
            text="Are you an artist?"
            control={control}
            onChangeHandler={handleIsArtist}
            value={isArtist}
            marginTop="15px"
            isDisabled={submission.status != ''}
          />
          {submission.isSubmitting ? (
            <Spinner size="lg" />
          ) : (
            <Button {...BUTTON_PROPS} rightIcon={<BiSearchAlt size={20} />}>
              Search
            </Button>
          )}
        </form>
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

  useEffect(() => {
    console.log(pinValue);
  }, [pinValue]);

  const handleCodeVerification = () => {
    if (pinValue == verificationCode) {
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
  const [submission, setSubmissionState] = useSubmissionState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(thirdStepSchema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmissionState({ isSubmitting: true });
      const newPassword = data.newPassword;

      console.log(newPassword, entityId, isArtist);

      const response = await changePassword({ newPassword, entityId, isArtist });

      console.log(data);

      setSubmissionState({
        status: 'success',
        isSubmitting: false,
        title: 'Success!',
        message: `${response.message}`,
      });

      setTimeout(() => nextStep(), 3000);
    } catch (error) {
      setSubmissionState({
        status: 'error',
        isSubmitting: false,
        title: 'Error',
        message: error,
      });
    }
  };

  return (
    <>
      <Heading {...HEADING_PROPS}>Third and last, change the password</Heading>
      <Box padding="10px 130px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <Field
              type="text"
              name="newPassword"
              label="Password"
              placeholder="************"
              error={errors.newPassword}
              register={register}
              isDisabled={submission.status != ''}
            />
            <Field
              type="text"
              name="newPasswordConfirmation"
              label="Confirm Password"
              placeholder="************"
              error={errors.newPasswordConfirmation}
              register={register}
              isDisabled={submission.status != ''}
            />
          </VStack>
          {submission.isSubmitting ? (
            <Spinner size="lg" />
          ) : (
            <Button {...BUTTON_PROPS} rightIcon={<BiSearchAlt size={20} />}>
              Search
            </Button>
          )}
        </form>
      </Box>
    </>
  );
}

const thirdStepSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Minimum eight (8) characters.')
    .required('This field is required.'),
  newPasswordConfirmation: yup
    .string()
    .required('This field is required.')
    .oneOf([yup.ref('newPassword'), null], 'Both passwords must match.'),
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
