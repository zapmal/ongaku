import { Input as ChakraInput, Text } from '@chakra-ui/react';
import React from 'react';

import { theme } from '@/stitches.config.js';

export function Field({ label, type, name, value, placeholder, error, onChange }) {
  return (
    <div>
      {label && (
        <Text color={theme.colors.primaryTextContrast.value} padding={2} fontWeight="bold">
          {label}
        </Text>
      )}
      <Input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        error={error}
        onChange={onChange}
      />
      {error && <Text>{error}</Text>}
    </div>
  );
}

/**
 * For some reason the input doesn't accept Stitches colors so
 * I had to use plain hex.
 */
function Input({ type, name, value, placeholder, error, onChange }) {
  return (
    <ChakraInput
      isInvalid={!!error}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      focusBorderColor={'#E93D82'}
    />
  );
}
