import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Heading,
  Divider,
  VStack,
  Center,
  Box,
  InputGroup,
  InputRightElement,
  Image,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineArrowRight } from 'react-icons/Ai';
import { FiEyeOff, FiEye } from 'react-icons/fi';

import * as yup from 'yup';

import { Link, Field, Button, Highlight } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function Login(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [show, setShow] = React.useState(false);

  const handleShow = () => setShow(!show);

  const onSubmit = () => {
    console.log("XD");
  }
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        motionPreset='slideInBottom'
        preserveScrollBarGap={true}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            <Text fontSize="2xl"><Highlight>Welcome back</Highlight></Text>
            <Heading fontSize="3xl" marginTop="5px">Log into your account</Heading>
            <Divider orientation="horizontal" w="125px" p={3} marginLeft={["105px", "130px"]} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack maxWidth="300px" marginLeft={["30px", "50px"]}>
                <Field
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="JoeMama@gmail.com"
                  error={errors.email}
                  register={register}
                />
                <InputGroup size='md'>
                  <Field
                    type={show ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    placeholder='********'
                    error={errors.password}
                    register={register}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' position="absolute" marginTop="85px" onClick={handleShow} variant="transparent">
                      {show ? <FiEyeOff /> : <FiEye />}
                    </Button>
                <Link to="/account-recovery" variant="gray" underline={false} position="absolute" width="130px" marginBottom="5px" marginRight="45px">Forgot password?</Link>
                  </InputRightElement>


                </InputGroup>
                <Button type="submit" variant="accent" rightIcon={<AiOutlineArrowRight />} marginTop="20px">
                  Login
                </Button>
              </VStack>
            </form>
          </ModalBody>
          <Center>
            <ModalFooter>

              <Text>Not registered yet?</Text>
              <Link to="/register" variant="accent" marginLeft="5px">Register</Link>

            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </>
  )
}

const schema = yup.object({
  email: yup.string().email('You must enter a valid email.').required('This field is required.'),
  password: yup
    .string()
    .min(8, 'Minimum eight (8) characters.')
    .required('This field is required.'),
});