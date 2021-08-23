import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

export function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  );
}

function Landing() {
  return <h1>welcome!</h1>;
}
