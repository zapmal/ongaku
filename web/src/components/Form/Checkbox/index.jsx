import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

export function Checkbox({
  control,
  name,
  onChangeHandler,
  value,
  isDisabled,
  text,
  ...extraProps
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <ChakraCheckbox
          onChange={(v) => {
            field.onChange(v);
            onChangeHandler();
          }}
          checked={value}
          isDisabled={isDisabled}
          colorScheme="pink"
          {...extraProps}
        >
          {text}
        </ChakraCheckbox>
      )}
    />
  );
}
