import { SimpleGrid, Image, Wrap, WrapItem, Box, Text, Heading, Spinner } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { registerUser } from '../api/register';
import { Footer } from '../components/Footer';
import { NavigationBar } from '../styles';

import { Link, Button } from '@/components/Elements';
import { Field } from '@/components/Form';
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
  const [requestStatus, setRequestStatus] = useState({
    status: '',
    isSubmitting: false,
  });
  const setUser = useAuthStore((s) => s.setUser);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const navigate = useNavigate();

  useEffect(() => {
    const requestStatusCleanup = setTimeout(() => {
      if (requestStatus.status !== 'success') {
        setRequestStatus((prevRequestStatus) => ({ ...prevRequestStatus, status: '' }));
      }
    }, 7000);

    return () => clearInterval(requestStatusCleanup);
  }, [requestStatus.status]);

  const onSubmit = async (data) => {
    try {
      setRequestStatus((prevRequestStatus) => ({ ...prevRequestStatus, isSubmitting: true }));

      const response = await registerUser(data);

      setRequestStatus({ status: 'success', isSubmitting: false });
      setUser(response.user);

      addNotification({
        title: 'Success!',
        message: `We'll redirect you to the home page shortly.`,
        status: 'success',
      });

      setTimeout(() => navigate('/'), 8000);
    } catch (error) {
      setRequestStatus({
        status: 'error',
        isSubmitting: false,
      });
      addNotification({
        title: 'Error',
        message: error,
        status: 'error',
      });
    }
  };

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
          <Heading>Almost there</Heading>
          <Text color={theme.colors.accentSolid.value} paddingTop="10px" fontSize="xl">
            Tell us about you.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Wrap paddingTop="20px" align="center">
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="text"
                  name="fullName"
                  label="Full Name"
                  placeholder="Joe Mama"
                  error={errors.fullname}
                  isDisabled={requestStatus.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="joemama@gmail.com"
                  isDisabled={requestStatus.status !== ''}
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
                  isDisabled={requestStatus.status !== ''}
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
                  isDisabled={requestStatus.status !== ''}
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
                  isDisabled={requestStatus.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
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
                  isDisabled={requestStatus.status !== ''}
                  register={register}
                />
              </WrapItem>
            </Wrap>

            {requestStatus.isSubmitting ? (
              <Spinner size="lg" marginTop="20px" />
            ) : (
              <>
                <Button
                  type="submit"
                  align="center"
                  variant="accent"
                  marginTop="30px"
                  isDisabled={requestStatus.status !== ''}
                >
                  Submit
                </Button>
                <Text color={theme.colors.primaryText.value} padding="5px">
                  or
                </Text>
                <Link to="/login" variant="gray">
                  Login
                </Link>
              </>
            )}

            <Footer paddingTop="30px" />
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