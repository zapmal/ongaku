import { Image } from '@chakra-ui/react';
import React from 'react';

export function Footer({ topMargin }) {
  return <Image src="/assets/images/footer.png" width="500px" margin={`${topMargin} auto`} />;
}
