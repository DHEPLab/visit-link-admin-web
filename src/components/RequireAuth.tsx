import { getToken } from "@/utils/token";
import { Navigate } from "react-router-dom";
import React, { PropsWithChildren } from "react";

const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
  return getToken() ? children : <Navigate to="/sign_in" replace />;
};

export default RequireAuth;
