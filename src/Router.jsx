import React from "react";
import styled from "styled-components";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getToken } from "./utils/token";

import {
  Babies,
  Baby,
  Curriculum,
  Curriculums,
  Module,
  Modules,
  Profiles,
  SignIn,
  Survey,
  Surveys,
  User,
  Users,
} from "./pages";
import Projects from "./pages/Projects";

const routes = [
  {
    path: "/profiles",
    component: Profiles,
  },
  {
    path: "/curriculums/create",
    component: Curriculum,
  },
  {
    path: "/curriculums/edit/:id",
    component: Curriculum,
  },
  {
    path: "/curriculums/:id",
    component: Curriculum,
  },
  {
    path: "/curriculums",
    component: Curriculums,
  },
  {
    path: "/surveys/create",
    component: Survey,
  },
  {
    path: "/surveys/edit/:id",
    component: Survey,
  },
  {
    path: "/surveys/:id",
    component: Survey,
  },
  {
    path: "/surveys",
    component: Surveys,
  },
  {
    path: "/users/:id",
    component: User,
  },
  {
    path: "/users",
    component: Users,
  },
  {
    path: "/babies/:id",
    component: Baby,
  },
  {
    path: "/babies",
    component: Babies,
  },
  {
    path: "/modules/edit/:id",
    component: Module,
  },
  {
    path: "/modules/copy/:id",
    component: Module,
  },
  {
    path: "/modules/create",
    component: Module,
  },
  {
    path: "/modules/:id",
    component: Module,
  },
  {
    path: "/modules",
    component: Modules,
  },
  {
    path: "/projects",
    component: Projects,
  },
  {
    path: "*",
    component: NoMatch,
  },
];

export default function Router() {
  return (
    <RouteView id="route-view">
      <Routes>
        <PrivateRoute exact path="/" render={() => <Navigate to="/users" replace />} />
        <Route path="/sign_in" render={() => <SignIn />} />
        {routes.map((route) => (
          <RouteWithSubRoutes key={route.path} {...route} />
        ))}
      </Routes>
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
              pathname: "/sign_in",
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
