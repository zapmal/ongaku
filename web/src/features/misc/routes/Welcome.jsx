import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { UserWelcome, ArtistWelcome } from './';

export function Welcome() {
  const location = useLocation();
  let pageToRender = null;

  if (location.search.includes('user')) {
    pageToRender = <UserWelcome />;
  } else if (location.search.includes('artist')) {
    pageToRender = <ArtistWelcome />;
  } else {
    pageToRender = <Navigate to="/" />;
  }

  return <div>{pageToRender}</div>;
}
