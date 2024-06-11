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
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ResetPasswordConfirmation from "./components/ResetPasswordConfirmation";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import Userprofile from "./components/Userprofile";
import Category from "./pages/Category/Category";
import ProductListingPage from "./pages/Product/ProductListingPage";
import ProductAdminPanel from "./components/product/ProductAdminPanel";
import SubcategoryPage from "./pages/Subcategory/SubcategoryPage";
import SubcategoryAdminPanel from "./pages/Subcategory/SubcategoryAdminPanel";
import CartPage from "./pages/Product/CartPage";
import ProductDetail from "./pages/Product/ProductDetail";

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
          path: "/category/:categoryId",
          element: (
            <ProtectedRoute>
              <SubcategoryPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/product-listing/:subcategoryName",
          element: (
            <ProtectedRoute>
              <ProductListingPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/cart-page",
          element: (
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/product-detail/:id",
          element: (
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "/user",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "profile",
              element: (
                <ProtectedRoute>
                  <Userprofile />
                </ProtectedRoute>
              ),
            },
            {
              path: "dashboard",
              element: (
                <ProtectedRoute>
                  <ProductAdminPanel />
                </ProtectedRoute>
              ),
            },
            {
              path: "create-category",
              element: (
                <ProtectedRoute>
                  <Category />
                </ProtectedRoute>
              ),
            },
            {
              path: "create-subcategory",
              element: (
                <ProtectedRoute>
                  <SubcategoryAdminPanel />
                </ProtectedRoute>
              ),
            },
          ],
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
