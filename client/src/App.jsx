// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirmation from "./components/ResetPasswordConfirmation";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "/signin",
          element: (
            <AuthRoute>
              <SignIn />
            </AuthRoute>
          ),
        },
        {
          path: "/signup",
          element: (
            <AuthRoute>
              <SignUp />
            </AuthRoute>
          ),
        },
        {
          path: "/reset-password",
          element: (
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          ),
        },
        {
          path: "/verify-email",
          element: <VerifyEmail />,
        },
        {
          path: "/reset-password-confirmation",
          element: (
            <AuthRoute>
              <ResetPasswordConfirmation />
            </AuthRoute>
          ),
        },
        {
          path: "/forgot-password",
          element: (
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={routes}></RouterProvider>
      <ToastContainer />
    </div>
  );
}
