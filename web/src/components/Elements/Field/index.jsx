import { FormControl, Text, FormHelperText, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';

import { theme } from '@/stitches.config.js';

export function Field(props) {
  const isRequired = props.isNotRequired ? false : true;

  return (
    <FormControl isRequired={isRequired}>
      {props.label && (
        <FormLabel
          color={theme.colors.primaryTextContrast.value}
          htmlFor={props.name}
          padding={1}
          fontWeight="bold"
        >
          {props.label}
        </FormLabel>
      )}
      <Input
        type={props.type}
        id={props.name}
        placeholder={props.placeholder}
        isInvalid={!!props.error}
        css={props.css}
        focusBorderColor={'#E93D82'}
        {...props.register(props.name)}
      />
      {props.error && (
        <Text color={theme.colors.dangerSolid.value} padding={1}>
          {props.error.message}
        </Text>
      )}
      {props.helperText && <FormHelperText padding={1}>{props.helperText}</FormHelperText>}
    </FormControl>
  );
}
