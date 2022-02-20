import {
  useDisclosure,
  SimpleGrid,
  Image,
  Wrap,
  WrapItem,
  Box,
  Text,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { MdDateRange } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Footer, Login } from '../';
import { registerUser } from '../api/auth';
import { NavigationBar } from '../styles';

import { Link, Button } from '@/components/Elements';
import { Field } from '@/components/Form';
import { Highlight } from '@/components/Utils';
import { useRequest } from '@/hooks';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';

const responsivePaddings = ['25%', '32%', '15%', '20%', '12%'];

export function UserRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      username: '',
      birthdate: '',
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [request, setRequestState] = useRequest();
  const setEntity = useAuthStore((s) => s.setEntity);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      setEntity(response.user);

      setRequestState({
        status: 'success',
        title: '¡Éxito!',
        message: `${response.message}, te redigiremos pronto`,
      });

      localStorage.setItem('isLoggedIn', true);
      setTimeout(() => navigate('/'), 8000);
    } catch (error) {
      setRequestState({
        status: 'error',
        title: 'Error',
        message: error,
      });
    }
  };

  return (
    <SimpleGrid columns={[1, 1, 1, 1, 2]}>
      <div>
        <NavigationBar>
          <Link to="/">
            <Image src="/assets/images/app-icon-transparent.png" alt="Ongaku Logo" />
          </Link>
          <Link to="/register" variant="gray" margin="40px 50px 40px 0">
            Volver
          </Link>
        </NavigationBar>

        <Box textAlign="center" align="center">
          <Heading>Ya casi estás listo</Heading>
          <Text paddingTop="10px" fontSize="xl">
            <Highlight>Dinos más sobre ti</Highlight>
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Wrap paddingTop="20px" align="center">
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="text"
                  name="fullName"
                  label="Nombre Completo"
                  placeholder="Joe Mama"
                  error={errors.fullName}
                  isDisabled={request.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="joemama@gmail.com"
                  isDisabled={request.status !== ''}
                  error={errors.email}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="password"
                  name="password"
                  label="Contraseña"
                  placeholder="*********"
                  error={errors.password}
                  isDisabled={request.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="password"
                  name="passwordConfirmation"
                  label="Confirmación de Contraseña"
                  placeholder="*********"
                  error={errors.passwordConfirmation}
                  isDisabled={request.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="text"
                  name="username"
                  label="Nombre de Usuario"
                  placeholder="xXJoeMama777Xx"
                  error={errors.username}
                  isDisabled={request.status !== ''}
                  register={register}
                />
              </WrapItem>
              <WrapItem paddingLeft={responsivePaddings}>
                <Field
                  type="date"
                  name="birthdate"
                  label="Fecha de nacimiento"
                  rightIcon={
                    // To display this icon ONLY on firefox (any version).
                    navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && (
                      <MdDateRange size={20} />
                    )
                  }
                  css={`
                    ::-webkit-calendar-picker-indicator {
                      filter: invert(1);
                    }
                  `}
                  error={errors.birthdate}
                  isDisabled={request.status !== ''}
                  register={register}
                />
              </WrapItem>
            </Wrap>

            {isSubmitting ? (
              <Spinner size="lg" marginTop="20px" />
            ) : (
              <Box textAlign="center" marginLeft="-10px">
                <Button
                  type="submit"
                  variant="accent"
                  marginTop="30px"
                  isDisabled={request.status !== ''}
                >
                  Enviar
                </Button>
                <Text color={theme.colors.primaryText.value} padding="5px">
                  o
                </Text>
                <Button variant="link" onClick={onOpen}>
                  Inicia Sesión
                </Button>
              </Box>
            )}
            <Footer paddingTop="35px" />
          </form>
        </Box>
      </div>

      <Image
        src="/assets/images/jennie-blackpink.webp"
        alt="Jennie, member of korean group Blackpink"
        height="100%"
        display={['none', 'none', 'none', 'none', 'inline']}
        fallbackSrc="https://via.placeholder.com/1080"
      />

      {isOpen && <Login isOpen={isOpen} onClose={onClose} />}
    </SimpleGrid>
  );
}

const schema = yup.object({
  fullName: yup.string().required('Este campo es requerido'),
  password: yup.string().min(8, 'Mínimo ocho (8) carácteres').required('Este campo es requerido'),
  passwordConfirmation: yup
    .string()
    .required('Este campo es requerido')
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir'),
  email: yup.string().email('Debes ingresar un correo válido').required('Este campo es requerido'),
  username: yup.string().required('Este campo es requerido'),
  birthdate: yup.string().required('Este campo es requerido'),
});
