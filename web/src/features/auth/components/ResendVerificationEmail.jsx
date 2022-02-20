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
import { useRequest } from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';

export function ResendVerificationEmail() {
  const entity = useAuthStore((s) => s.entity);
  const [request, setRequestState] = useRequest();

  const handleResendClick = async () => {
    try {
      setRequestState({ isSubmitting: true });

      const response = await resendVerificationEmail({ to: entity.email });

      setRequestState({
        status: 'success',
        isSubmitting: false,
        title: '¡Email enviado éxitosamente!',
        message: response.message,
      });
    } catch (error) {
      setRequestState({
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
            <Heading fontSize="2xl">No has verificado tu correo</Heading>
            <Divider orientation="horizontal" w="125px" p={3} marginLeft={['50px', '130px']} />
          </ModalHeader>
          <ModalBody textAlign="center">
            <VStack>
              <Text>
                Como se mencionó en el proceso de registración, necesitas{' '}
                <Highlight>verificar tu correo</Highlight> para empezar a usar Ongaku. Esto es para
                asegurar la seguridad de nuestra comunidad.
              </Text>
              {request.isSubmitting ? (
                <Spinner size="lg" />
              ) : (
                <Button
                  marginTop="10px"
                  rightIcon={<MdReplay />}
                  variant="accent"
                  onClick={handleResendClick}
                  isDisabled={request.status != ''}
                >
                  Reenviar
                </Button>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter display="block" textAlign="center">
            <Text fontSize="sm" color="gray.400">
              Si consideras que esto es un error, contáctanos:
              <Highlight> ongaku.official@gmail.com</Highlight>
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
