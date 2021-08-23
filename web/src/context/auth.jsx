import { Spinner } from '@chakra-ui/react';
import React from 'react';
import { initReactQueryAuth } from 'react-query-auth';

const loadUser = async () => {};

const loginFn = async (data) => {};

const registerFn = async (data) => {};

const logoutFn = async () => {};

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
  LoaderComponent() {
    return (
      <div>
        <Spinner />
      </div>
    );
  },
};

export const { AuthProvider, useAuth } = initReactQueryAuth(authConfig);
