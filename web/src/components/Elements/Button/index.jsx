import { Button as ChakraButton, Text, Box } from '@chakra-ui/react';
import React from 'react';

import { theme } from '@/stitches.config.js';

const variants = {
  primary: {
    backgroundColor: theme.colors.primaryBg.value,
    hover: theme.colors.primaryBgHover.value,
    active: theme.colors.primaryBgActive.value,
    text: theme.colors.primaryTextContrast,
  },
  accent: {
    backgroundColor: theme.colors.accentSolid.value,
    hover: theme.colors.accentSolidHover.value,
    active: theme.colors.accentSolidActive.value,
    text: theme.colors.primaryTextContrast,
  },
  link: {
    backgroundColor: 'transparent',
    text: theme.colors.primaryText.value,
    padding: 0,
    underline: 'underline',
    fontWeight: 'normal',
  },
  transparent: {
    backgroundColor: 'transparent',
    text: theme.colors.primaryText.value,
    padding: 0,
  },
  danger: {
    backgroundColor: theme.colors.dangerSolid.value,
    hover: theme.colors.dangerSolidHover.value,
    active: theme.colors.dangerSolidActive.value,
    text: 'white',
  },
};

export function Button({
  variant = 'primary',
  label = '',
  position = 'top',
  isFullWidth = false,
  onClick,
  align,
  type,
  children,
  ...extraProps
}) {
  return (
    <Box textAlign={align}>
      {label && position === 'top' && <Label text={label} position="top" />}

      <ChakraButton
        onClick={onClick}
        isFullWidth={isFullWidth}
        backgroundColor={variants[variant].backgroundColor}
        color={variants[variant].text}
        textDecoration={variants[variant].underline}
        padding={variants[variant].padding}
        fontWeight={variants[variant].fontWeight}
        _hover={{
          bg: variants[variant].hover,
        }}
        _active={{
          bg: variants[variant].active,
        }}
        type={type}
        {...extraProps}
      >
        {children}
      </ChakraButton>

      {label && position === 'bottom' && <Label text={label} position="bottom" />}
    </Box>
  );
}

function Label({ text, position }) {
  const margin = position === 'top' ? { marginBottom: '8px' } : { marginTop: '8px' };

  return (
    <Text fontSize={['xs', 'sm']} {...margin} fontWeight="bold" color={variants.text}>
      {text}
    </Text>
  );
}
