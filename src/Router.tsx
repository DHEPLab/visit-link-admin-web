/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import Layout from "./Layout";
import React from "react";

const SignIn = React.lazy(() => import("@/pages/SignIn"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const Projects = React.lazy(() => import("@/pages/Projects"));
const Modules = React.lazy(() => import("@/pages/Modules"));
const Module = React.lazy(() => import("@/pages/Module"));
const Babies = React.lazy(() => import("@/pages/Babies/Babies"));
const Baby = React.lazy(() => import("@/pages/Baby/Baby"));
const Users = React.lazy(() => import("@/pages/Users"));
const User = React.lazy(() => import("@/pages/User"));
const Surveys = React.lazy(() => import("@/pages/Surveys"));
const Survey = React.lazy(() => import("@/pages/Survey"));
const Curriculums = React.lazy(() => import("@/pages/Curriculums"));
const Curriculum = React.lazy(() => import("@/pages/Curriculum/Curriculum"));
const Profiles = React.lazy(() => import("@/pages/Profiles"));

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
