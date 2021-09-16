import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Example = () => {
  return <h2>auth woo</h2>;
};

export function ProtectedRoutes() {
  return (
    <Switch>
      <Route path="/example" component={Example}></Route>
      {/* <Route path="/" component={Landing} /> */}
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  );
}
