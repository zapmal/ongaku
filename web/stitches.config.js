import { createCss } from '@stitches/react';
// import { gray, violetDark } from '@radix-ui/colors';

export const { styled, css, global, keyframes, getCssString, theme } =
  createCss({
    theme: {
      colors: {
        // ...gray,
        // ...violetDark,
        // primary: '$gray1',
        // secondary: '$violet9',
        // secondaryLight: '$violet11',
        // secondaryDark: '$violet7',
      },
      fonts: {
        main: 'Poppins',
        fallback: 'Roboto',
        generic: 'Segoe UI',
      },
      fontSizes: {
        tiny: '0.625rem',
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
      space: {
        1: '5px',
        1.1: '6px',
        2: '10px',
        3: '15px',
        4: '20px', 
        4.5: '25px',
        5: '30px',
        5.5: '35px', 
        6: '40px',
        6.5: '45px',
        7: '60px',
        7.5: '65px',
        8: '80px',
        8.5: '85px',
        9: '120px', 
        10: '160px',
        11: '240px',
        12: '320px',
        13: '480px',
        14: '640px',
        15: '800px',
        16: '960px',
        'n1/2': '-50%',
      },
      sizes: {},
      letterSpacings: {
        light: '2px',
        basic: '4px',
        strong: '8px',
      },
      shadows: {
        bottom: '0 4px 0 -2px',
      },
    },
    media: {},
    utils: {},
  });

export const globalStyles = global({
  body: {
    margin: 0,
    padding: 0,
    fontFamily: '$main, $secondary, $fallback',
  },
});
