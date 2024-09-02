import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { getToken } from "./utils/token";

import {
  Babies,
  Baby,
  Curriculum,
  Curriculums,
  Module,
  Modules,
  NotFound,
  Profiles,
  Projects,
  SignIn,
  Survey,
  Surveys,
  User,
  Users,
} from "./pages";
import Layout from "./Layout";

function RequireAuth({ children }) {
  return getToken() ? children : <Navigate to="/sign_in" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "/",
        element: (
          <RequireAuth>
            <Navigate to="/users" replace />
          </RequireAuth>
        ),
      },
      {
        path: "/sign_in",
        element: <SignIn />,
      },
      {
        path: "/profiles",
        Component: Profiles,
      },
      {
        path: "/curriculums/create",
        Component: Curriculum,
      },
      {
        path: "/curriculums/edit/:id",
        Component: Curriculum,
      },
      {
        path: "/curriculums/:id",
        Component: Curriculum,
      },
      {
        path: "/curriculums",
        Component: Curriculums,
      },
      {
        path: "/surveys/create",
        Component: Survey,
      },
      {
        path: "/surveys/edit/:id",
        Component: Survey,
      },
      {
        path: "/surveys/:id",
        Component: Survey,
      },
      {
        path: "/surveys",
        Component: Surveys,
      },
      {
        path: "/users/:id",
        Component: User,
      },
      {
        path: "/users",
        Component: Users,
      },
      {
        path: "/babies/:id",
        Component: Baby,
      },
      {
        path: "/babies",
        Component: Babies,
      },
      {
        path: "/modules/edit/:id",
        Component: Module,
      },
      {
        path: "/modules/copy/:id",
        Component: Module,
      },
      {
        path: "/modules/create",
        Component: Module,
      },
      {
        path: "/modules/:id",
        Component: Module,
      },
      {
        path: "/modules",
        Component: Modules,
      },
      {
        path: "/projects",
        Component: Projects,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

export default router;
