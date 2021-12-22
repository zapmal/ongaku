import { Box, Heading, Text, Divider } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Elements';
import { Highlight } from '@/components/Utils';

export function ThirdStep() {
  return (
    <div>
      <Box textAlign="left">
        <Heading size="lg" paddingTop="10px">
          Registration finished!
        </Heading>
        <Text padding="20px">
          You should check your <Highlight>email inbox</Highlight> and complete the final step, the
          confirmation, so that {"you'll"} be able to start publishing and managing your work here
          on Ongaku!
        </Text>
        <Button marginLeft="20px" as={Link} to={'/welcome?type=artist'}>
          Go to Ongaku
        </Button>
      </Box>
      <Divider padding="10px" width="90%" />
    </div>
  );
}
