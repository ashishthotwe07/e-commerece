import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";
import { userSelector } from "../redux/reducers/userSlice";

const AuthRoute = ({ children }) => {
  const { user } = useSelector(userSelector);

  return user ? <Navigate to="/" /> : children;
};

export default AuthRoute;
