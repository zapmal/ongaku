import React from 'react';

import { AppProvider } from '@/providers';
import { AppRoutes } from '@/routes';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
