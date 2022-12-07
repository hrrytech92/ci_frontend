import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import LoginView from '../../views/login/Login';

const Login: FunctionComponent = () => (
  <Switch>
    <Route exact path="/login" component={LoginView} />
    <Redirect exact path="/*" to="/login" />
  </Switch>
);

export default Login;
