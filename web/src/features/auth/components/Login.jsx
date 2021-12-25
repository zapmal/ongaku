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
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { FiEyeOff, FiEye } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import * as yup from 'yup';

import { Link, Button } from '@/components/Elements';
import { Field } from '@/components/Form';
import { Highlight } from '@/components/Utils';
import { useNotificationStore } from '@/stores/useNotificationStore';

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
  // Easter egg.
  const location = useLocation();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const handleShow = () => {
    console.log('click');
    setShow(!show);
  };

  const onSubmit = () => {
    console.log('XD');
  };

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        motionPreset="slideInBottom"
        preserveScrollBarGap={true}
        isCentered
      >
        <ModalOverlay />
        <ModalContent width={['75%', '80%']}>
          <ModalHeader textAlign="center">
            <Text fontSize="2xl">
              <Highlight>Welcome back</Highlight>
            </Text>
            <Heading fontSize="3xl" marginTop="5px">
              Log into your account
            </Heading>
            <Divider orientation="horizontal" w="125px" p={3} marginLeft={['50px', '130px']} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack maxWidth="300px" marginLeft={['20px', '45px']}>
                <Field
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="JoeMama@gmail.com"
                  error={errors.email}
                  register={register}
                />
                <InputGroup size="md">
                  <Field
                    type={show ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    placeholder="********"
                    error={errors.password}
                    register={register}
                  />
                  <InputRightElement width="50px">
                    <Button
                      h="30px"
                      position="absolute"
                      marginTop="85px"
                      onClick={handleShow}
                      variant="transparent"
                    >
                      {show ? <FiEyeOff /> : <FiEye />}
                    </Button>
                    <Link
                      to="/account-recovery"
                      variant="gray"
                      position="absolute"
                      width="130px"
                      marginBottom="5px"
                      marginRight="70px"
                    >
                      Forgot password?
                    </Link>
                  </InputRightElement>
                </InputGroup>
                <Button
                  type="submit"
                  variant="accent"
                  rightIcon={<AiOutlineArrowRight />}
                  marginTop="20px"
                >
                  Login
                </Button>
              </VStack>
            </form>
          </ModalBody>
          <Center>
            <ModalFooter display="block" textAlign="center">
              <Text>Not registered yet?</Text>
              {location.pathname === '/register' ? (
                <Button
                  variant="link"
                  onClick={() => {
                    addNotification({
                      title: 'Easter Egg',
                      type: 'info',
                      message: 'Congratulations! You played yourself. You are already here.',
                    });
                    props.onClose();
                  }}
                >
                  Register
                </Button>
              ) : (
                <Link to="/register" variant="accent" marginLeft="5px">
                  Register
                </Link>
              )}
            </ModalFooter>
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
}

const schema = yup.object({
  email: yup.string().email('You must enter a valid email.').required('This field is required.'),
  password: yup
    .string()
    .min(8, 'Minimum eight (8) characters.')
    .required('This field is required.'),
});
