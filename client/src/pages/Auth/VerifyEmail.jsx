import React, { useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyEmail } from "../../redux/reducers/userSlice";
import { useDispatch } from "react-redux";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const dispatch = useDispatch();
  const userId = sessionStorage.getItem("userId");
  const email = sessionStorage.getItem("email");
  console.log(userId, email);

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(
        verifyEmail({ userId, otp: otp.join("") })
      ).unwrap();

      console.log(response);
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("email");

      toast.success(response?.message);
      navigate("/");
    } catch (error) {
      console.error("Error occurred while verifying email:", error);
      setOtp(["", "", "", ""]);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleresend = async () => {
    setLoading(true);
    try {
      setOtp(["", "", "", ""]);
      await axios.post("http://localhost:5000/api/auth/resend", {
        userId: userId,
      });
      toast.success("OTP resent successfully");
    } catch (error) {
      console.error("Error occurred while resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < refs.length - 1) {
      refs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowLeft" && index > 0) {
      refs[index - 1].current.focus();
    } else if (e.key === "ArrowRight" && index < refs.length - 1) {
      refs[index + 1].current.focus();
    }
  };

  return (
    <div className="relative flex outlet flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Verify Your Email</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>
                We have sent a code to your email{" "}
                <span className="text-blue-600">{email}</span>
                <br />
                please check your inbox
              </p>
            </div>
          </div>

          <div>
            <form onSubmit={handleVerification}>
              <div className="flex flex-col space-y-10">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  {otp.map((digit, index) => (
                    <div className="w-16 h-16" key={index}>
                      <input
                        ref={refs[index]}
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-400 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
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
                      disabled={loading}
                    >
                      {loading ? (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="w-6 h-6 text-gray-200 animate-spin m-auto fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Verify Account"
                      )}
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
