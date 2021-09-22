import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Field } from '@/components/Elements';
import { Landing, NotFound } from '@/features/misc';

export function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} exact={true} />
      <Route path="/login" component={FormUtils} exact={true} />
      {/* <Route path="*" render={() => <Redirect to="/" />} /> */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function FormUtils() {
  return (
    <div>
      <Field label="Hey" type="text" name="hey" />
      <Field label="Hey" type="text" name="hey" />
      <Field label="Hey" type="text" name="hey" />
    </div>
  );
}
