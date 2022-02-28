import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';

import { theme, styled } from '@/stitches.config.js';

export function BulletPoint({ Icon, title, content, variant = 'primary', ...extraProps }) {
  return (
    <Flex {...extraProps}>
      <IconWrapper wrapped={true} size={50} variant={variant}>
        <Icon />
      </IconWrapper>
      <Box width="70%">
        <Text
          fontSize="lg"
          color={theme.colors.accentSolid.value}
          fontWeight="bold"
          paddingLeft="15px"
        >
          {title}
        </Text>
        <Text paddingLeft="15px" color={theme.colors.primaryText.value}>
          {content}
        </Text>
      </Box>
    </Flex>
  );
}

export function IconWrapper({ variant, wrapped = false, size = 40, children }) {
  return wrapped ? (
    <Wrapper backgroundColor={variant}>
      {React.cloneElement(children, { color: '#ffffff', size })}
    </Wrapper>
  ) : (
    React.cloneElement(children, { color: '#ffffff', size })
  );
}

const Wrapper = styled('div', {
  padding: '$4',
  borderRadius: '20px',
  width: '14%',
  height: '10%',
  transition: '200ms ease-in',

  '& *': {
    margin: '0 auto',
  },

  '&:hover': {
    backgroundColor: '$accentSolidHover',
  },

  variants: {
    backgroundColor: {
      primary: {
        backgroundColor: '$primaryBg',
      },
      accent: {
        backgroundColor: '$accentSolid',
      },
    },
  },

  '@sm': {
    padding: '$2',
    width: '20%',
    height: '60%',
  },

  defaultVariants: {
    backgroundColor: 'primary',
  },
});
