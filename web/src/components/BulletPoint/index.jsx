import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';

import { Icon as IconWrapper } from '@/components/Elements';
import { theme } from '@/stitches.config.js';

export function BulletPoint({ Icon, title, content, variant = 'primary', extraProps }) {
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
