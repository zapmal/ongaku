import { Box, Heading, Text, Image, Spinner } from '@chakra-ui/react';
import React from 'react';
import { MdCheck } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { verifyEmail } from '../api/verification';

import { Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { NavigationBar } from '@/features/misc';
import { useRequest } from '@/hooks';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';

export function VerifyEmail() {
  const [entity, setEntity] = useAuthStore((s) => [s.entity, s.setEntity]);
  const [request, setRequestState] = useRequest();
  const { hash } = useParams();

  const handleVerifyClick = async () => {
    try {
      setRequestState({ isSubmitting: true });

      const response = await verifyEmail({
        id: entity.id,
        hash,
        email: entity.email,
        role: entity.role,
      });
      setEntity({ ...entity, verifiedEmail: response.verifiedEmail });

      setRequestState({
        status: 'success',
        isSubmitting: false,
        title: '¡Éxito!',
        message: `Te redigiremos pronto`,
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
      <NavigationBar />
      <Box align="center" paddingTop={['40px', '20px']}>
        <Heading size="lg">
          <Highlight>¡Gracias por elegirnos!</Highlight>
        </Heading>

        <Text
          color={theme.colors.primaryTextContrast.value}
          padding="20px"
          fontSize="lg"
          width={['100%', '550px']}
        >
          Este es el último paso para el registro, después de esto, podrás disfrutar Ongaku a su
          límite.
        </Text>

        {request.isSubmitting ? (
          <Spinner size="lg" marginTop="30px" />
        ) : (
          <Button
            onClick={handleVerifyClick}
            isDisabled={request.status != ''}
            variant="accent"
            rightIcon={<MdCheck size={25} />}
            size="lg"
            marginTop="5px"
          >
            Verificar
          </Button>
        )}
        <Image src="/assets/svgs/undraw-dreamer.svg" width={['300px', '400px']} margin="5px" />
      </Box>
    </>
  );
}
