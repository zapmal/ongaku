import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotFound } from '@/features/misc';

const Example = () => {
  return <h2>auth woo</h2>;
};

export function ProtectedRoutes() {
  return (
    <Switch>
      <Route path="/example" component={Example}></Route>
      <Route path="*" component={NotFound} />
    </Switch>
  );
}
