import { SimpleGrid, Image, Center, Wrap, WrapItem, Box, Text, Heading } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Background, ArtistImage, HeaderContainer } from '../styles';

import { Link, Field, Button } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

const schema = yup.object().shape({
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
  birthday: yup.string().required('This field is required.'),
});

export function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: null,
      password: null,
      passwordConfirmation: null,
      email: null,
      username: null,
      birthday: null,
    },
  });

  const onSubmit = (data) => console.log(data);

  return (
    <Background>
      <SimpleGrid columns={2}>
        <div>
          <HeaderContainer>
            <Image src="/assets/images/logo-transparent.png" alt="Ongaku Logo" />
            <Link to="/" variant="gray" marginTop="50px" marginRight="50px">
              Go Back
            </Link>
          </HeaderContainer>

          <Box textAlign="center">
            <Heading>Almost there</Heading>
            <Text
              color={theme.colors.accentSolid.value}
              paddingTop={4}
              fontSize="xl"
              fontWeight="bold"
            >
              Tell us a bit more about you.
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Wrap paddingTop="20px">
                <WrapItem paddingLeft="80px">
                  <Center>
                    <Field
                      type="text"
                      name="fullname"
                      label="Full Name"
                      placeholder="Joe Mama"
                      error={errors.fullname}
                      register={register}
                    />
                  </Center>
                </WrapItem>
                <WrapItem paddingLeft="90px">
                  <Center>
                    <Field
                      type="password"
                      name="password"
                      label="Password"
                      placeholder="*********"
                      error={errors.password}
                      register={register}
                    />
                  </Center>
                </WrapItem>
                <WrapItem paddingLeft="80px">
                  <Center>
                    <Field
                      type="text"
                      name="email"
                      label="Email"
                      placeholder="joemama@gmail.com"
                      error={errors.email}
                      register={register}
                    />
                  </Center>
                </WrapItem>
                <WrapItem paddingLeft="90px">
                  <Center>
                    <Field
                      type="password"
                      name="passwordConfirmation"
                      label="Password Confirmation"
                      placeholder="*********"
                      error={errors.passwordConfirmation}
                      register={register}
                    />
                  </Center>
                </WrapItem>
                <WrapItem paddingLeft="80px">
                  <Center>
                    <Field
                      type="text"
                      name="username"
                      label="Username"
                      placeholder="xXJoeMama777Xx"
                      error={errors.username}
                      register={register}
                    />
                  </Center>
                </WrapItem>
                <WrapItem paddingLeft="90px">
                  <Center>
                    <Field
                      type="date"
                      name="birthday"
                      label="Birthdate"
                      css={`
                        ::-webkit-calendar-picker-indicator {
                          filter: invert(1);
                        }
                      `}
                      error={errors.birthday}
                      register={register}
                    />
                  </Center>
                </WrapItem>
              </Wrap>

              <Center paddingTop="40px">
                <Button type="submit" align="center" variant="accent" isFullWidth={true}>
                  Upload
                </Button>
                <Text color={theme.colors.primaryText.value} padding="0 10px">
                  or
                </Text>
                <Link to="/" variant="gray">
                  Sign In
                </Link>
              </Center>

              <Center paddingTop="40px">
                <Text color={theme.colors.primaryText.value} maxW="400px">
                  We also store your IP address and registration date for security purposes.
                </Text>
              </Center>
            </form>
          </Box>
        </div>

        <ArtistImage
          src="/assets/images/half-background.jpg"
          alt="Jennie, member of korean group Blackpink"
          fallbackSrc="https://via.placeholder.com/1080"
        />
      </SimpleGrid>
    </Background>
  );
}
