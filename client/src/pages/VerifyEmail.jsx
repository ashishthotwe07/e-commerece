import React, { useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyEmail } from "../redux/reducers/userSlice";
import { useDispatch } from "react-redux";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const dispatch = useDispatch();
  // Retrieve user ID and email from session storage
  const userId = sessionStorage.getItem("userId");
  const email = sessionStorage.getItem("email");
  console.log(userId, email);

  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        verifyEmail({ userId, otp: otp.join("") })
      ).unwrap();

      console.log(response);
      // Clear session storage after retrieving data
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("email");

      toast.success(response?.message);
      navigate("/");
    } catch (error) {
      console.error("Error occurred while verifying email:", error);
      setOtp(["", "", "", ""]);
      toast.error(error.message);
    }
  };

  const handleresend = async () => {
    try {
      setOtp(["", "", "", ""]);
      await axios.post("http://localhost:5000/api/auth/resend", {
        userId: userId,
      });
      toast.success("OTP resent successfully");
    } catch (error) {
      console.error("Error occurred while resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again later.");
    }
  };

  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input field if a digit is entered
    if (value && index < refs.length - 1) {
      refs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move focus to the previous or next input field when left or right arrow keys are pressed
    if (e.key === "ArrowLeft" && index > 0) {
      refs[index - 1].current.focus();
    } else if (e.key === "ArrowRight" && index < refs.length - 1) {
      refs[index + 1].current.focus();
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {email}</p>
            </div>
          </div>

          <div>
            <form onSubmit={handleVerification}>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  {otp.map((digit, index) => (
                    <div class="w-16 h-16 ">
                      <input
                        key={index}
                        ref={refs[index]}
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                      type="submit"
                      className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                    >
                      Verify Account
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't receive code?</p>{" "}
                    <p
                      onClick={handleresend}
                      className="flex flex-row cursor-pointer items-center text-blue-600"
                      rel="noopener noreferrer"
                    >
                      Resend
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
