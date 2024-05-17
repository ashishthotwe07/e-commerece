// components/ProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { userSelector } from "../redux/reducers/userSlice";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(userSelector);

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
