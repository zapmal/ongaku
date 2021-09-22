import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Landing, NotFound } from '@/features/misc';

export function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} exact={true} />
      {/* <Route path="*" render={() => <Redirect to="/" />} /> */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

