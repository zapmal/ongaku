import { SimpleGrid, Image, Box, Text, Heading } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { useState } from 'react';

import { Footer } from '../components/Footer';
import { FirstStep, SecondStep, ThirdStep } from '../components/steps';
import { NavigationBar } from '../styles';

import { Link } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

const labels = ['Basic Information', 'Artistic Information', 'End'];

export function ArtistRegister() {
  const [stepState, setStepState] = useState(undefined);
  const [basicData, setBasicData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const { nextStep, prevStep, _, activeStep } = useSteps({
    initialStep: 0,
  });

  return (
    <SimpleGrid columns={[1, 1, 1, 1, 2]}>
      <div>
        <NavigationBar>
          <Image src="/assets/images/app-icon-transparent.png" alt="Ongaku Logo" />
          <Link to="/register" variant="gray" margin="50px 50px 0 0">
            Go Back
          </Link>
        </NavigationBar>

        <Box textAlign="center" align="center">
          <Heading paddingTop="10px">You&apos;re almost part of our team</Heading>
          <Text color={theme.colors.accentSolid.value} paddingTop="10px" fontSize="xl">
            Tell us about you.
          </Text>
        </Box>

        <Steps
          state={stepState}
          activeStep={activeStep}
          colorScheme="pink"
          padding="30px 40px"
          orientation="vertical"
          responsive={false}
        >
          <Step key={labels[0]} label={labels[0]}>
            <FirstStep
              nextStep={nextStep}
              setStepState={setStepState}
              setBasicData={setBasicData}
            />
          </Step>
          <Step key={labels[1]} label={labels[1]}>
            <SecondStep
              nextStep={nextStep}
              prevStep={prevStep}
              setStepState={setStepState}
              basicData={basicData}
            />
          </Step>
          <Step key={labels[2]} label={labels[2]}>
            <ThirdStep />
          </Step>
        </Steps>

        <Footer />
      </div>

      <Image
        src="/assets/images/dahyun-twice.webp"
        alt="Dahyun, rapper and vocalist of korean group Twice"
        height="100%"
        display={['none', 'none', 'none', 'none', 'inline']}
        fallbackSrc="https://via.placeholder.com/1080"
      />
    </SimpleGrid>
  );
}
