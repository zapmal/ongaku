import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  Heading,
  Divider,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import React from 'react';
import { MdReplay } from 'react-icons/md';

import { resendVerificationEmail } from '../api/verification';

import { Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { useSubmissionState } from '@/hooks/useSubmissionState';
import { useAuthStore } from '@/stores/useAuthStore';

export function ResendVerificationEmail() {
  const entity = useAuthStore((s) => s.entity);
  const [submission, setSubmissionState] = useSubmissionState();

  const handleResendClick = async () => {
    try {
      setSubmissionState({ isSubmitting: true });

      // eslint-disable-next-line no-unused-vars
      const _ = await resendVerificationEmail({ to: entity.email });

      setSubmissionState({
        status: 'success',
        isSubmitting: false,
        title: 'Email sent!',
        message: 'Please check your inbox for more instructions, you can close this now',
      });
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
      <Modal isOpen={true} motionPreset="slideInBottom" preserveScrollBarGap={true} isCentered>
        <ModalOverlay />
        <ModalContent width={['75%', '80%']}>
          <ModalHeader textAlign="center">
            <Heading fontSize="2xl">You have not verified your email</Heading>
            <Divider orientation="horizontal" w="125px" p={3} marginLeft={['50px', '130px']} />
          </ModalHeader>
          <ModalBody textAlign="center">
            <VStack>
              <Text>
                As it was stated on the registration process, you need to{' '}
                <Highlight>verify your email</Highlight> to start using{' '}
                <Highlight>Ongaku</Highlight>, this is for both your and our safety and protection.
              </Text>
              {submission.isSubmitting ? (
                <Spinner size="lg" />
              ) : (
                <Button
                  marginTop="10px"
                  rightIcon={<MdReplay />}
                  variant="accent"
                  onClick={handleResendClick}
                  isDisabled={submission.status != ''}
                >
                  Resend
                </Button>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter display="block" textAlign="center">
            <Text fontSize="sm" color="gray.400">
              If you think this is a mistake, contact us at:
              <Highlight> ongaku.official@gmail.com</Highlight>
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
