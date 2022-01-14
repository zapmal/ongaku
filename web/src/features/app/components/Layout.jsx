import React from 'react';
import { Outlet } from 'react-router-dom';

import { NavigationBar } from './NavBar';
import { Player } from './Player';

export function AppLayout() {
  return (
    <>
      <NavigationBar />
      <Outlet />
      <Player />
    </>
  );
}
