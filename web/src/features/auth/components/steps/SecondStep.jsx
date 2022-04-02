/* eslint-disable no-unused-vars */
import { useDisclosure, Wrap, WrapItem, Box, Text, Center, Spinner } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { registerArtist } from '../../api/auth';
import { responsivePaddings, MUSIC_GENRES, COUNTRIES } from '../../constants';
import { Login } from '../Login';

import { Button } from '@/components/Elements';
import { Field, Select, Checkbox } from '@/components/Form';
import { useRequest } from '@/hooks';
import { theme } from '@/stitches.config.js';
import { useAuthStore } from '@/stores/useAuthStore';
import { getLink } from '@/utils/getLink';

export function SecondStep({ nextStep, prevStep, setStepState, basicData }) {
  const {
    register,
    control,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(secondStepSchema),
    defaultValues: {
      country: '',
      genres: [],
      labels: '',
      yearsActive: 0,
      isBand: false,
      artisticName: '',
      bandName: '',
      members: '',
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [request, setRequestState] = useRequest();
  const setEntity = useAuthStore((s) => s.setEntity);
  const [isBand, setIsBand] = useState(false);

  const onSubmit = async (data) => {
    const { members, labels, isBand, bandName, artisticName, ...artistData } = data;
    const [_, bandNameLink] = getLink(bandName, bandName);
    const [__, artisticNameLink] = getLink(artisticName, artisticName);

    const conditionalData = isBand
      ? {
          members: members.split(','),
          labels: labels.split(','),
          bandName: bandNameLink,
        }
      : {
          labels: labels.split(','),
          artisticName: artisticNameLink,
        };

    try {
      const response = await registerArtist({
        ...artistData,
        ...basicData,
        ...conditionalData,
        isBand,
      });
      nextStep();

      setTimeout(() => {
        window.location.assign('/welcome?type=artist');

        setEntity(response.artist);

        setRequestState({
          status: 'success',
        });

        localStorage.setItem('isLoggedIn', true);
      }, 3000);
    } catch (error) {
      setRequestState({
        status: 'error',
        title: 'Error',
        message: error,
      });
    }
  };

  const handleIsBand = () => {
    if (isBand) {
      resetField('members');
      resetField('bandName');
    } else {
      resetField('artisticName');
    }

    setIsBand(!isBand);
  };

  useEffect(() => {
    if (errors && Object.keys(errors).length !== 0) {
      setStepState('error');
    } else {
      setStepState(undefined);
    }
  }, [errors, setStepState]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Wrap>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box width="200px" marginRight="5px">
            <Text
              textAlign="left"
              marginTop="10px"
              paddingBottom="10px"
              paddingLeft="5px"
              fontWeight="bold"
            >
              Géneros
            </Text>
            <Select
              control={control}
              options={[...MUSIC_GENRES]}
              name="genres"
              placeholder="Hip-Hop, Rap, etc"
              error={errors.genres}
              onChangeCallback={(value) => value.map((v) => v.value)}
              isMulti
              isDisabled={request.status != ''}
            />
            {errors.genres && (
              <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
                {errors.genres.message}
              </Text>
            )}
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            <Field
              type="text"
              name="labels"
              label="Sello(s) Musical(es)"
              placeholder="JM Records, Hybe"
              helperText="Deben estar divididos con comas si formas parte de más de uno"
              error={errors.labels}
              isDisabled={request.status != ''}
              register={register}
            />
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box maxWidth="205px">
            <Field
              type="number"
              name="yearsActive"
              label="Años Activo"
              placeholder="13"
              error={errors.yearsActive}
              isDisabled={request.status != ''}
              register={register}
            />
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            {isBand ? (
              <Field
                type="text"
                name="bandName"
                label="Nombre de la Banda"
                placeholder="Joe n' the Mamas"
                error={errors.bandName}
                isDisabled={request.status != ''}
                register={register}
              />
            ) : (
              <Field
                type="text"
                name="artisticName"
                label="Nombre Artístico"
                placeholder="Lil xxxJoemama"
                error={errors.artisticName}
                isDisabled={request.status != ''}
                register={register}
              />
            )}
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box width="200px" maxWidth="300px" marginRight="5px">
            <Text
              textAlign="left"
              marginTop="10px"
              paddingBottom="10px"
              paddingLeft="5px"
              fontWeight="bold"
            >
              País
            </Text>
            <Select
              control={control}
              options={[...COUNTRIES]}
              name="country"
              placeholder="Venezuela"
              error={errors.country}
              isDisabled={request.status != ''}
              onChangeCallback={(value) => value.value}
            />
            {errors.country && (
              <Text color={theme.colors.dangerSolid.value} paddingTop="5px" textAlign="left">
                {errors.country.message}
              </Text>
            )}
          </Box>
        </WrapItem>
        <WrapItem paddingLeft={responsivePaddings}>
          <Box>
            <Field
              type="text"
              name="members"
              label="Miembros"
              helperText="Deben estar divididos por comas"
              placeholder="Joe Mama, Carl Johnson"
              error={errors.members}
              isDisabled={!isBand || request.status != ''}
              register={register}
            />
          </Box>
        </WrapItem>
      </Wrap>

      <Checkbox
        name="isBand"
        text="¿Es una banda?"
        control={control}
        value={isBand}
        onChangeHandler={handleIsBand}
        isDisabled={request.status != ''}
        marginTop="30px"
        marginLeft="30px"
        size="lg"
      />

      {isSubmitting ? (
        <Center marginTop="40px">
          <Spinner size="lg" />
        </Center>
      ) : (
        <div>
          <Center marginTop="40px">
            <Button onClick={prevStep} margin="0 30px" isDisabled={request.status != ''}>
              Volver
            </Button>
            <Button type="submit" align="center" variant="accent" isDisabled={request.status != ''}>
              Enviar
            </Button>
          </Center>

          <Box padding="10px 0 5px 0" marginLeft="35px">
            <Text color={theme.colors.primaryText.value}>or</Text>
            <Button variant="link" onClick={onOpen}>
              Iniciar Sesión
            </Button>
          </Box>
        </div>
      )}
      {isOpen && <Login isOpen={isOpen} onClose={onClose} />}
    </form>
  );
}

const secondStepSchema = yup.object({
  country: yup.string().required('Este campo es requerido'),
  genres: yup
    .array()
    .min(1, 'Debes seleccionar al menos un género')
    .required('Este campo es requerido'),
  labels: yup.string().required('Este campo es requerido'),
  yearsActive: yup
    .number()
    .transform((parsedValue, originalValue) => (originalValue === '' ? undefined : parsedValue))
    .required('Este campo es requerido')
    .positive('Debe ser un número positivo')
    .integer('Debe ser un número entero'),
  isBand: yup.boolean(),
  artisticName: yup.string().when('isBand', {
    is: false,
    then: yup.string().required('Este campo es requerido'),
  }),
  bandName: yup.string().when('isBand', {
    is: true,
    then: yup.string().required('Este campo es requerido'),
  }),
  members: yup.string().when('isBand', {
    is: true,
    then: yup.string().required('Este campo es requerido'),
  }),
});
