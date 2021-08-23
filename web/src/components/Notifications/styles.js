import { ToastContainer } from 'react-toastify';

import { styled } from '@/stitches.config.js';

export const Toast = styled(ToastContainer, {
  '.Toastify__progress-bar': {
    backgroundColor: '$accentSolid',
  },
});
