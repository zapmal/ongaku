import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Route, Switch } from 'react-router-dom';
import * as yup from 'yup';

import { Field } from '@/components/Elements';
import { Landing, NotFound } from '@/features/misc';

export function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} exact={true} />
      {/* <Route path="/login" component={FormTesting} exact={true} /> */}
      {/* <Route path="*" render={() => <Redirect to="/" />} /> */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

// Example of form validation

// const schema = yup.object().shape({
//   age: yup.number().positive().required('Este campo es requerido.'),
// });

// function FormTesting() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: yupResolver(schema) });

//   const onSubmit = (data) => console.log(data);

//   console.log(errors);

//   return (
//     <div style={{ width: '50%' }}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Field type="number" name="age" label="Full Name" error={errors.age} register={register} />
//         <button type="submit">upload</button>
//       </form>
//     </div>
//   );
// }
