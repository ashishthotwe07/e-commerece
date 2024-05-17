import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-pass",
        { email }
      );

      console.log(response);
      // Handle successful response
      toast.success("A link to reset password has been sent to your email");
      // Navigate to sign-in page
      navigate("/reset-password-confirmation");
    } catch (error) {
      // Handle error if needed, but we're using toast for success, so no need for error handling here
      console.error("Error:", error);
    }
  };

  return (
    <main
      id="content"
      role="main"
      className="w-96 mx-auto min-h-screen flex items-center justify-center "
    >
      <div className="mt-7 w-96 bg-white rounded-xl shadow-lg border-2 ">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Remember your password?
              <a
                className="text-blue-600 decoration-2 hover:underline font-medium"
                href="/signin"
              >
                Login here
              </a>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold ml-1 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter Email "
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
