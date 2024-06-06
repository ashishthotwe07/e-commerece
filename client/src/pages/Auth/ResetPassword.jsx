import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const location = useLocation();
  let params = new URLSearchParams(document.location.search);
  let token = params.get("token");
  let id = params.get("id");
  const navigate = useNavigate();
  console.log(token, id);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-pass?token=${token}&id=${id}`,
        {
          password: password,
        }
      );

      toast.success(res.data.message);
      navigate("/signin");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <main
      id="content"
      role="main"
      className="w-96 mx-auto outlet flex items-center justify-center "
    >
      <div className="mt-7 w-96 bg-white rounded-xl shadow-lg border-2 ">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">
              Reset Password
            </h1>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold ml-1 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter New Password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold ml-1 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
