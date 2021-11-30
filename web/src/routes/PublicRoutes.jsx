import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { UserRegister, ArtistRegister, ChooseUserType } from '@/features/auth';
import { Landing, NotFound } from '@/features/misc';

export function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} exact={true} />
      <Route path="/register" component={ChooseUserType} exact={true} />
      <Route path="/register/user" component={UserRegister} exact={true} />
      <Route path="/register/artist" component={ArtistRegister} exact={true} />
      {/* <Route path="*" render={() => <Redirect to="/" />} /> */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
