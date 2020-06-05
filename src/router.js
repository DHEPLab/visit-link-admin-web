import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { getToken } from './utils/token';
import styled from 'styled-components';

import Home from './pages/Home';
import Login from './pages/Login';
import Curriculumns from './pages/Curriculums';
import Accounts from './pages/Accounts';
import Modules from './pages/Modules';

export default function () {
  return (
    <RouteView>
      <Switch>
        <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute>
        <Route path="/login">
          <Login />
        </Route>
        <PrivateRoute path="/curriculums">
          <Curriculumns />
        </PrivateRoute>
        <PrivateRoute path="/modules">
          <Modules />
        </PrivateRoute>
        <PrivateRoute path="/accounts">
          <Accounts />
        </PrivateRoute>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </RouteView>
  );
}

const RouteView = styled.div`
  flex: 1;
  padding: 30px;
  overflow: auto;
  max-height: calc(100vh - 80px);
`;

function NoMatch() {
  return <div>Page not found</div>;
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        getToken() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
