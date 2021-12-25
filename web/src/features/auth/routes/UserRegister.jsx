import {
  useDisclosure,
  SimpleGrid,
  Image,
  Wrap,
  WrapItem,
  Box,
  Text,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { MdDateRange } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Footer, Login } from '../';
import { registerUser } from '../api/register';
import { NavigationBar } from '../styles';

import { Link, Button } from '@/components/Elements';
import { Field } from '@/components/Form';
import { Highlight } from '@/components/Utils';
import { useSubmissionState } from '@/hooks/useSubmissionState';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

const responsivePaddings = ['25%', '32%', '15%', '20%', '12%'];

export function UserRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      username: '',
      birthdate: '',
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submission, setSubmissionState] = useSubmissionState();
  const setEntity = useAuthStore((s) => s.setEntity);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setSubmissionState((prevState) => ({ ...prevState, isSubmitting: true }));

      const response = await registerUser(data);

      setSubmissionState({ status: 'success', isSubmitting: false });
      setEntity(response.user);

      addNotification({
        title: 'Success!',
        message: `We'll redirect you to the home page shortly.`,
        status: 'success',
      });

      setTimeout(() => navigate('/'), 8000);
    } catch (error) {
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

  return (
    <SimpleGrid columns={[1, 1, 1, 1, 2]}>
      <div>
        <NavigationBar>
          <Link to="/">
            <Image src="/assets/images/app-icon-transparent.png" alt="Ongaku Logo" />
          </Link>
          <Link to="/register" variant="gray" margin="50px 50px 0 0">
            Go Back
          </Link>
        </NavigationBar>

        <Box textAlign="center" align="center">
          <Heading>Almost there</Heading>
          <Text paddingTop="10px" fontSize="xl">
            <Highlight>Tell us about you.</Highlight>
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Wrap paddingTop="20px" align="center">
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="text"
                  name="fullName"
                  label="Full Name"
                  placeholder="Joe Mama"
                  error={errors.fullName}
                  isDisabled={submission.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="joemama@gmail.com"
                  isDisabled={submission.status !== ''}
                  error={errors.email}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="*********"
                  error={errors.password}
                  isDisabled={submission.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="password"
                  name="passwordConfirmation"
                  label="Password Confirmation"
                  placeholder="*********"
                  error={errors.passwordConfirmation}
                  isDisabled={submission.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="text"
                  name="username"
                  label="Username"
                  placeholder="xXJoeMama777Xx"
                  error={errors.username}
                  isDisabled={submission.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="date"
                  name="birthdate"
                  label="Birthdate"
                  rightIcon={
                    // To display this icon ONLY on firefox (any version).
                    navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && (
                      <MdDateRange size={20} />
                    )
                  }
                  css={`
                    ::-webkit-calendar-picker-indicator {
                      filter: invert(1);
                    }
                  `}
                  error={errors.birthdate}
                  isDisabled={submission.status !== ''}
                  register={register}
                />
              </WrapItem>
            </Wrap>

            {submission.isSubmitting ? (
              <Spinner size="lg" marginTop="20px" />
            ) : (
              <Box textAlign="center" marginLeft="35px">
                <Button
                  type="submit"
                  variant="accent"
                  marginTop="30px"
                  isDisabled={submission.status !== ''}
                >
                  Submit
                </Button>
                <Text color={theme.colors.primaryText.value} padding="5px">
                  or
                </Text>
                <Button variant="link" onClick={onOpen}>
                  Login
                </Button>
              </Box>
            )}
            <Footer paddingTop="35px" />
          </form>
        </Box>
      </div>

      <Image
        src="/assets/images/jennie-blackpink.webp"
        alt="Jennie, member of korean group Blackpink"
        height="100%"
        display={['none', 'none', 'none', 'none', 'inline']}
        fallbackSrc="https://via.placeholder.com/1080"
      />

      {isOpen && <Login isOpen={isOpen} onClose={onClose} />}
    </SimpleGrid>
  );
}

const schema = yup.object({
  fullName: yup.string().required('This field is required.'),
  password: yup
    .string()
    .min(8, 'Minimum eight (8) characters.')
    .required('This field is required.'),
  passwordConfirmation: yup
    .string()
    .required('This field is required.')
    .oneOf([yup.ref('password'), null], 'Both passwords must match.'),
  email: yup.string().email('You must enter a valid email.').required('This field is required.'),
  username: yup.string().required('This field is required.'),
  birthdate: yup.string().required('This field is required.'),
});
