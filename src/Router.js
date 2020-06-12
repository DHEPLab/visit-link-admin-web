import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { getToken } from './utils/token';
import styled from 'styled-components';

import { SignIn, Profiles, Curriculums, User, Users, Babies, Modules } from './pages/*';

const routes = [
  {
    path: '/profiles',
    component: Profiles,
  },
  {
    path: '/curriculums',
    component: Curriculums,
  },
  {
    path: '/users/:id',
    component: User,
  },
  {
    path: '/users',
    component: Users,
  },
  {
    path: '/babies',
    component: Babies,
  },
  {
    path: '/modules',
    component: Modules,
  },
  {
    path: '*',
    component: NoMatch,
  },
];

export default function () {
  return (
    <RouteView>
      <Switch>
        <PrivateRoute exact path="/" render={() => <Redirect to="/users" />} />
        <Route path="/sign_in" render={() => <SignIn />} />
        {routes.map((route) => (
          <RouteWithSubRoutes key={route.path} {...route} />
        ))}
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

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route) {
  return (
    <PrivateRoute
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

function PrivateRoute({ render, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        getToken() ? (
          render()
        ) : (
          <Redirect
            to={{
              pathname: '/sign_in',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function NoMatch() {
  const location = useLocation();
  return (
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  );
}
