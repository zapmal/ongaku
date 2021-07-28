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
        main: 'Segoe UI',
        fallback: 'Helvetica',
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
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        4.5: '24px',
        5: '32px',
        5.5: '48px',
        6: '64px',
        6.5: '96px',
        7: '128px',
        7.5: '192px',
        8: '256px',
        9: '384px',
        10: '512px',
        11: '640px',
        12: '768px',
        '1/2': '50%',
      },
      /**
       * If none of these work (or feel right), use percentages.
       * This is base 20, spacing is base 16.
       */
      sizes: {
        1: '10px',
        2: '15px',
        3: '20px',
        3.5: '25px',
        4: '30px',
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
      },
      letterSpacings: {
        light: '2px',
        basic: '4px',
        strong: '8px',
      },
      shadows: {
        underlineShadow: '0 4px 0 -2px',
      },
    },
    media: {},
    utils: {},
  });
