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
  Spinner,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdEyeOff, IoMdEye } from 'react-icons/io';
import { MdArrowForward } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { login } from '../api/auth';

import { Link, Button } from '@/components/Elements';
import { Field, Checkbox } from '@/components/Form';
import { Highlight } from '@/components/Utils';
import { useSubmissionState } from '@/hooks/useSubmissionState';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

export function Login(props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      isArtist: false,
    },
  });
  const [show, setShow] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [submission, setSubmissionState] = useSubmissionState();
  const navigate = useNavigate();

  const setEntity = useAuthStore((s) => s.setEntity);

  // Easter egg.
  const { pathname } = useLocation();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const handleShow = () => setShow(!show);
  const handleIsArtist = () => setIsArtist(!isArtist);

  const onSubmit = async (data) => {
    try {
      setSubmissionState({ isSubmitting: true });

      const response = await login(data);
      setEntity(response.entity);

      setSubmissionState({
        status: 'success',
        isSubmitting: false,
        title: 'Success!',
        message: `${response.message}, we'll redirect you shortly`,
      });

      setTimeout(() => navigate('/home'), 8000);
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
                  isDisabled={submission.status != ''}
                  register={register}
                />
                <InputGroup size="md">
                  <Field
                    type={show ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    placeholder="********"
                    error={errors.password}
                    isDisabled={submission.status != ''}
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
                      {show ? <IoMdEyeOff /> : <IoMdEye />}
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
                <Checkbox
                  name="isArtist"
                  text="Are you an artist?"
                  control={control}
                  onChangeHandler={handleIsArtist}
                  value={isArtist}
                  isDisabled={submission.status != ''}
                  size="md"
                  padding="5px 0"
                />

                {submission.isSubmitting ? (
                  <Spinner size="lg" />
                ) : (
                  <Button
                    type="submit"
                    variant="accent"
                    rightIcon={<MdArrowForward size={20} />}
                    marginTop="5px"
                    isDisabled={submission.status != ''}
                  >
                    Login
                  </Button>
                )}
              </VStack>
            </form>
          </ModalBody>
          <Center>
            <ModalFooter display="block" textAlign="center">
              <Text>Not registered yet?</Text>
              {pathname === '/register' ? (
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
  isArtist: yup.boolean(),
});
