import { Wrap, WrapItem, Box, Center } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { responsivePaddings } from '../../constants';

import { Button } from '@/components/Elements';
import { Field } from '@/components/Form';

export function FirstStep({ nextStep, setStepState, setBasicData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(firstStepSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  useEffect(() => {
    if (errors && Object.keys(errors).length !== 0) {
      setStepState('error');
    } else {
      setStepState(undefined);
    }
  }, [errors, setStepState]);

  const onSubmit = (data) => {
    setBasicData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Wrap paddingLeft={responsivePaddings}>
        <WrapItem>
          <Box>
            <Field
              type="email"
              name="email"
              label="Email"
              placeholder="joemama@gmail.com"
              error={errors.email}
              register={register}
            />
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={[0, 0, '10%', 0, '5%']}>
          <Box>
            <Field
              type="password"
              name="password"
              label="Contraseña"
              placeholder="********"
              error={errors.password}
              register={register}
            />
          </Box>
        </WrapItem>
        <WrapItem>
          <Box>
            <Field
              type="password"
              name="passwordConfirmation"
              label="Confirmación de Contraseña"
              placeholder="********"
              error={errors.passwordConfirmation}
              register={register}
            />
          </Box>
        </WrapItem>
      </Wrap>
      <Center>
        <Button type="submit" variant="accent" margin="40px 0">
          Siguiente
        </Button>
      </Center>
    </form>
  );
}

const firstStepSchema = yup.object({
  email: yup.string().email('Debes ingresar un correo válido').required('Este campo es requerido'),
  password: yup.string().min(8, 'Mínimo ocho (8) carácteres').required('Este campo es requerido'),
  passwordConfirmation: yup
    .string()
    .required('ESte campo es requerido')
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir'),
});
