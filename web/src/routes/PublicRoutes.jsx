import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Landing } from '@/features/misc';

/**
 * No 404 for now, although it can be changed later.
 */
export function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} exact={true} />
      {/* <Route path="/login" component={Epa} /> */}
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  );
}
