import { SimpleGrid, Image, Wrap, WrapItem, Box, Text, Heading, useDisclosure } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';

import { Footer, Login } from '../';
import { NavigationBar } from '../styles';

import { Link, Field, Button, Highlight } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

const responsivePaddings = ['25%', '32%', '15%', '20%', '12%'];

export function UserRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      username: '',
      birthdate: '',
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = (data) => console.log(data);

  return (
    <SimpleGrid columns={[1, 1, 1, 1, 2]}>
      <div>
        <NavigationBar>
          <RouterLink to="/">
            <Image src="/assets/images/app-icon-transparent.png" alt="Ongaku Logo" />
          </RouterLink>
          <Box margin="40px 50px 0 0">
          <Link to="/register" variant="gray">
            Go Back
          </Link>
          </Box>
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
                  name="fullname"
                  label="Full Name"
                  placeholder="Joe Mama"
                  error={errors.fullname}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="joemama@gmail.com"
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
                  register={register}
                />
              </WrapItem>
            </Wrap>

            <Button type="submit" align="center" variant="accent" marginTop="50px">
              Submit
            </Button>
            <Text color={theme.colors.primaryText.value} paddingTop="10px">
              or
            </Text>
            <Button variant="link" onClick={onOpen}>
              Login
            </Button>

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
      <Login isOpen={isOpen} onClose={onClose} />
    </SimpleGrid>
  );
}

const schema = yup.object({
  fullname: yup.string().required('This field is required.'),
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
