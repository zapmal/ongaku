import { SimpleGrid, Image, Center, Wrap, WrapItem, Box, Text, Heading } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { NavigationBar } from '../styles';

import { Link, Field, Button } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

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

export function Register() {
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

  const onSubmit = (data) => console.log(data);

  return (
    <SimpleGrid columns={[1, 2]}>
      <div>
        <NavigationBar>
          <Image src="/assets/images/logo-transparent.png" alt="Ongaku Logo" />
          <Link to="/" variant="gray" margin="50px 50px 0 0">
            Go Back
          </Link>
        </NavigationBar>

        <Box textAlign="center">
          <Heading>Almost there</Heading>
          <Text
            color={theme.colors.accentSolid.value}
            paddingTop="10px"
            fontSize="xl"
            fontWeight="bold"
          >
            Tell us about you.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Wrap paddingTop="20px">
              <WrapItem paddingLeft={['20%', '80px']}>
                <Field
                  type="text"
                  name="fullname"
                  label="Full Name"
                  placeholder="Joe Mama"
                  error={errors.fullname}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={['20%', '80px']}>
                <Field
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="joemama@gmail.com"
                  error={errors.email}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={['20%', '80px']}>
                <Field
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="*********"
                  error={errors.password}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={['20%', '80px']}>
                <Field
                  type="password"
                  name="passwordConfirmation"
                  label="Password Confirmation"
                  placeholder="*********"
                  error={errors.passwordConfirmation}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={['20%', '80px']}>
                <Field
                  type="text"
                  name="username"
                  label="Username"
                  placeholder="xXJoeMama777Xx"
                  error={errors.username}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={['20%', '80px']}>
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

            <Button type="submit" align="center" variant="accent" marginTop="40px">
              Submit
            </Button>
            <Text color={theme.colors.primaryText.value} padding="5px">
              or
            </Text>
            <Link to="/login" variant="gray">
              Login
            </Link>

            <Center paddingTop="30px" paddingBottom="5px">
              <Text color={theme.colors.primaryText.value} maxW={['300px', '500px']}>
                By using our application you agree to the usage of cookies, which are needed to make
                the application work correctly. We also store your IP address and registration date
                for security purposes.
              </Text>
            </Center>
            <Center paddingBottom={['30px', '10px']}>
              <Text fontWeight="bold">All rights belong to their respective owners.</Text>
            </Center>
          </form>
        </Box>
      </div>

      <Image
        src="/assets/images/jennie-blackpink.webp"
        alt="Jennie, member of korean group Blackpink"
        height="100%"
        display={['none', 'inline']}
        fallbackSrc="https://via.placeholder.com/1080"
      />
    </SimpleGrid>
  );
}
