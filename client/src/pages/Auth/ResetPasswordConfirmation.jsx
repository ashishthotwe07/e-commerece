import React from "react";
import { Link } from "react-router-dom";

function ResetPasswordConfirmation() {
  return (
    <main
      id="content"
      role="main"
      className="w-96 mx-auto outlet flex items-center justify-center"
    >
      <div className="mt-7 w-96 bg-white rounded-xl shadow-lg border-2">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">
              Password Reset Confirmation
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              A link to reset your password has been sent to your email. Please
              check your inbox.
            </p>
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              to="/signin"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordConfirmation;
