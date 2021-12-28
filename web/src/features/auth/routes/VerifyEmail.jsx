import { Box, Heading, Text, Image, Spinner } from '@chakra-ui/react';
import React from 'react';
import { MdCheck } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { markAsVerified } from '../api';

import { Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';
import { NavigationBar } from '@/features/misc';
import { useSubmissionState } from '@/hooks/useSubmissionState';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

export function VerifyEmail() {
  const [entity, setEntity] = useAuthStore((s) => [s.entity, s.setEntity]);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [submission, setSubmissionState] = useSubmissionState();
  const { hash } = useParams();

  const handleVerifyClick = async () => {
    try {
      setSubmissionState((prevState) => ({ ...prevState, isSubmitting: true }));

      const response = await markAsVerified({
        id: entity.id,
        hash,
        email: entity.email,
        role: entity.role,
      });

      setSubmissionState({ status: 'success', isSubmitting: false });
      setEntity({ ...entity, verifiedEmail: response.verifiedEmail });

      addNotification({
        title: 'Success!',
        message: `We'll redirect you to the home page shortly.`,
        status: 'success',
      });
    } catch (error) {
      setSubmissionState({
        status: 'error',
        isSubmitting: false,
      });

      if (error.message === 'canceled') {
        addNotification({
          title: 'Error',
          message: 'We could not process your request, try again later',
          status: 'error',
        });
      } else {
        addNotification({
          title: 'Error',
          message: error,
          status: 'error',
        });
      }
    }
  };

  return (
    <>
      <NavigationBar />
      <Box align="center" paddingTop={['40px', '20px']}>
        <Heading size="lg">
          <Highlight>Thank you for choosing us</Highlight>
        </Heading>

        <Text
          color={theme.colors.primaryTextContrast.value}
          padding="20px"
          fontSize="lg"
          width={['100%', '550px']}
        >
          This is the last registration step, after this, you will be able to use and enjoy Ongaku
          to {"it's"} fullest!
        </Text>

        {submission.isSubmitting ? (
          <Spinner size="lg" marginTop="30px" />
        ) : (
          <Button
            onClick={handleVerifyClick}
            isDisabled={submission.status != ''}
            variant="accent"
            rightIcon={<MdCheck size={25} />}
            size="lg"
            marginTop="5px"
          >
            Verify
          </Button>
        )}
        <Image src="/assets/svgs/undraw-dreamer.svg" width={['300px', '400px']} margin="5px" />
      </Box>
    </>
  );
}
