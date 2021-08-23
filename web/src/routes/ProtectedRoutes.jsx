import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const App = () => {
  return <h2>auth woo</h2>;
};

const Landing = () => {
  return <h2>welcome</h2>;
};

export const ProtectedRoutes = () => {
  return (
    <Switch>
      <Route path="/example" component={App}></Route>
      <Route path="/" component={Landing} />
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  );
};
