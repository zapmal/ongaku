import {
  SimpleGrid,
  Image,
  Box,
  Text,
  Heading,
  PinInput,
  PinInputField,
  HStack,
  VStack,
  useDisclosure,
  ButtonGroup,
  Spinner,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiSearchAlt } from 'react-icons/bi';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';

import { sendRecoveryCode, changePassword } from '../api/recovery';
import { Login } from '../components/Login';

import { Footer } from '@/components/Core';
import { Link, Button } from '@/components/Elements';
import { Field, Checkbox } from '@/components/Form';
import { Highlight } from '@/components/Utils';
import { useRequest } from '@/hooks';
import { theme } from '@/stitches.config.js';

const BOX_PROPS = {
  borderWidth: '1px',
  borderColor: 'gray',
  borderRadius: '2xl',
  maxWidth: '40%',
  margin: 'auto',
  textAlign: 'center',
};

const HEADING_PROPS = {
  fontSize: '3xl',
  margin: '20px 25px 0 25px',
};

const BUTTON_PROPS = {
  type: 'submit',
  variant: 'accent',
  margin: '25px 0',
  padding: '25px',
};

export function AccountRecovery() {
  const [stepState] = useState(undefined);
  const [isArtist, setIsArtist] = useState(false);
  const [verificationCode, setVerificationCode] = useState(0);
  const [entityId, setEntityId] = useState(0);

  const { nextStep, activeStep } = useSteps({
    initialStep: 3,
  });

  return (
    <SimpleGrid>
      <Link to="/">
        <Image
          src="/assets/images/app-icon-transparent.png"
          alt="Ongaku Logo"
          margin="5px auto"
          height="100px"
          maxWidth="150px"
        />
      </Link>

      <VStack>
        <Heading marginTop="10px">
          Recupera el <Highlight>acceso</Highlight> a tu cuenta
        </Heading>
        <Text padding="15px" width="40%" textAlign="center">
          Te guiaremos a través del proceso de recuperación, pero, ten en cuenta que necesitarás{' '}
          <Highlight>obligatoriamente</Highlight> tener acceso al correo asociado con dicha cuenta
          para que la recuperación sea exitosa.
        </Text>
      </VStack>

      <Steps
        state={stepState}
        activeStep={activeStep}
        padding="30px 20px 50px 30px"
        orientation="horizontal"
      >
        <Step label="Buscar el Correo" description="Tendrás intentos limitados">
          <Box {...BOX_PROPS}>
            <FirstStep
              nextStep={nextStep}
              isArtist={isArtist}
              setIsArtist={setIsArtist}
              setVerificationCode={setVerificationCode}
              setEntityId={setEntityId}
            />
          </Box>
        </Step>
        <Step
          label="Ingresar el Código"
          description="Si no lo recibiste, espera e intenta otra vez"
        >
          <Box {...BOX_PROPS}>
            <SecondStep nextStep={nextStep} verificationCode={verificationCode} />
          </Box>
        </Step>
        <Step label="Cambiar Contraseña" description="Usa un gestor de contraseñas!">
          <Box {...BOX_PROPS}>
            <ThirdStep nextStep={nextStep} isArtist={isArtist} entityId={entityId} />
          </Box>
        </Step>
        <Step label="Listo">
          <Box {...BOX_PROPS}>
            <FourthStep />
          </Box>
        </Step>
      </Steps>

      <Box margin="auto" paddingTop="15px" as={Link} to="/" variant="gray">
        Volver
      </Box>

      <Footer topMargin="25px" />
    </SimpleGrid>
  );
}

function FirstStep({ nextStep, isArtist, setIsArtist, setVerificationCode, setEntityId }) {
  const [request, setRequestState] = useRequest();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(firstStepSchema),
    defaultValues: {
      email: '',
      isArtist: false,
    },
  });

  const handleIsArtist = () => setIsArtist(!isArtist);

  const onSubmit = async (data) => {
    try {
      const response = await sendRecoveryCode(data);

      setVerificationCode(response.code);
      setEntityId(response.entityId);

      setRequestState({
        status: 'success',
        title: '¡Éxito!',
        message: `${response.message}`,
      });

      setTimeout(() => nextStep(), 3000);
    } catch (error) {
      setRequestState({
        status: 'error',
        title: 'Error',
        message: error,
      });
    }
  };

  return (
    <>
      <Heading {...HEADING_PROPS}>
        Encontremos tu <Highlight>cuenta</Highlight>
      </Heading>
      <Box padding="15px 60px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            type="text"
            name="email"
            label="Email"
            placeholder="joemama@gmail.com"
            error={errors.email}
            isDisabled={request.status != ''}
            register={register}
          />
          <Checkbox
            name="isArtist"
            text="¿Eres un artista?"
            control={control}
            onChangeHandler={handleIsArtist}
            value={isArtist}
            marginTop="15px"
            isDisabled={request.status != ''}
          />
          {isSubmitting ? (
            <Spinner size="lg" display="block" margin="25px auto" />
          ) : (
            <Button {...BUTTON_PROPS} rightIcon={<BiSearchAlt size={20} />}>
              Buscar
            </Button>
          )}
        </form>
      </Box>
    </>
  );
}

const firstStepSchema = yup.object({
  email: yup.string().email('Debes ingresar un correo válido').required('Este campo es requerido'),
});

function SecondStep({ nextStep, verificationCode }) {
  const [pinValue, setPinValue] = useState('');
  const [error, setError] = useState('');

  const handleCodeVerification = () => {
    if (pinValue == verificationCode) {
      nextStep();
      setError(null);
    } else {
      setError('Código inválido, revisa tu correo e intenta otra vez');
    }
  };

  return (
    <>
      <Heading {...HEADING_PROPS}>
        ¿Recibiste el <Highlight>código</Highlight>?
      </Heading>
      <Text margin="20px 0">Ingresa el código de 6 digitos que enviamos a tu correo</Text>
      <Box padding="0 110px">
        <HStack margin="10px" borderColor={error && theme.colors.dangerSolid.value}>
          <PinInput onChange={(value) => setPinValue(value)} focusBorderColor="pink.500">
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
        {error && <Text color={theme.colors.dangerSolid.value}>{error}</Text>}

        <Button {...BUTTON_PROPS} onClick={handleCodeVerification}>
          Enviar
        </Button>
      </Box>
    </>
  );
}

function ThirdStep({ nextStep, isArtist, entityId }) {
  const [submission, setSubmissionState] = useRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(thirdStepSchema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const onSubmit = async ({ newPassword }) => {
    try {
      const response = await changePassword({ newPassword, entityId, isArtist });

      setSubmissionState({
        status: 'success',
        title: '¡Éxito!',
        message: `${response.message}`,
      });

      setTimeout(() => nextStep(), 3000);
    } catch (error) {
      setSubmissionState({
        status: 'error',
        title: 'Error',
        message: error,
      });
    }
  };

  return (
    <>
      <Heading {...HEADING_PROPS}>Ingresa tu nueva contraseña</Heading>
      <Box padding="10px 130px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <Field
              type="text"
              name="newPassword"
              label="Contraseña"
              placeholder="************"
              error={errors.newPassword}
              register={register}
              isDisabled={submission.status != ''}
            />
            <Field
              type="text"
              name="newPasswordConfirmation"
              label="Nueva Contraseña"
              placeholder="************"
              error={errors.newPasswordConfirmation}
              register={register}
              isDisabled={submission.status != ''}
            />
          </VStack>
          {isSubmitting ? <Spinner size="lg" /> : <Button {...BUTTON_PROPS}>Enviar</Button>}
        </form>
      </Box>
    </>
  );
}

const thirdStepSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Mínimo ocho (8) carácteres')
    .required('Este campo es requerido'),
  newPasswordConfirmation: yup
    .string()
    .required('Este campo es requerido')
    .oneOf([yup.ref('newPassword'), null], 'Las contraseñas deben coincidir'),
});

function FourthStep() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Heading {...HEADING_PROPS}>
        <Highlight>Éxito</Highlight>
      </Heading>
      <Box padding="10px 5px">
        <Text width="100%" padding="0 20px">
          <Highlight>¡Bienvenido devuelta!</Highlight> ahora puedes entrar a Ongaku y empezar a
          escuchar, disfrutar y compartir tus canciones y artistas favoritos con amigos, familia y
          más.
        </Text>
        <ButtonGroup spacing="5" margin="20px">
          <Button variant="accent" padding="20px" onClick={onOpen}>
            Iniciar Sesión
          </Button>
          <Button as={RouterLink} to="/" padding="20px">
            Ir a Inicio
          </Button>
        </ButtonGroup>
      </Box>

      {isOpen && <Login isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
