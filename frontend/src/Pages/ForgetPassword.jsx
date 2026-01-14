import React, { useState } from "react";
import logo from "../assets/viewtube.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showAlertHandler } from "../components/CustomAlert";
import { ClipLoader } from "react-spinners";

function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        showAlertHandler("email is not valid");
        return;
      }
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/sendotp`,
        { email },
        { withCredentials: true }
      );
      console.log(result.data.message);
      showAlertHandler("otp send successfully to your mail");
      setStep(2);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
      showAlertHandler(error.response.data.message);
    }
  };
  const handleVarifyOtp = async () => {
    try {
      if (!otp) {
        showAlertHandler("please enter the otp");
        return;
      }
      setLoading(true);
      const result = await axios.post(`${serverUrl}/api/auth/varifyotp`, {
        email,
        otp,
      });
      console.log(result.data.message);
      showAlertHandler("otp varified sucessfully");
      setStep(3);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
      showAlertHandler(error.response.data.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!newPassword || newPassword !== confirmPassword) {
        showAlertHandler("Both password are not match");
        return;
      }
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/resetpassword`,
        { email, password: newPassword },
        { withCredentials: true }
      );
      console.log(result.data);
      showAlertHandler("Password updated sucessfully");
      navigate("/signin");
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
      showAlertHandler(error.response.data.message);
    }
  };

  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[#202124] text-white">
      <header className="flex items-center gap-2 p-4 border-b border-gray-700">
        <img src={logo} alt="" className="w-8 h-8" />
        <span className="text-white font-bold text-xl tracking-tight font-roboto">
          ViewTube
        </span>
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        {step === 1 && (
          <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">
              Forget your password
            </h2>
            <form
              action=""
              className="space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Enter your email address
                </label>
                <input
                  type="email"
                  id="email"
                  className=" w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 transition py-2  rounded-md font-medium flex items-center justify-center"
                onClick={handleSendOtp}
              >
                {loading ? <ClipLoader size={20} color="black" /> : "Send OTP"}
              </button>
            </form>
            <div
              className="text-sm text-orange-400 text-center mt-4 cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Back to signIn
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Enter OTP</h2>
            <form
              action=""
              className="space-y-3"
              onClick={(e) => e.preventDefault()}
            >
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Enter 4-digit code sent to your email
                </label>
                <input
                  type="text"
                  id="otp"
                  className=" w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 transition py-2  rounded-md font-medium flex items-center justify-center"
                onClick={handleVarifyOtp}
              >
                {loading ? (
                  <ClipLoader size={20} color="black" />
                ) : (
                  "Varify OTP"
                )}
              </button>
            </form>
            <div
              className="text-sm text-orange-400 text-center mt-4 cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Back to signIn
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Reset your password</h2>
            <p className="text-sm text-gray-400 mb-6">
              Enter a new password below to regian access to your account
            </p>
            <form
              action=""
              className="space-y-3"
              onClick={(e) => e.preventDefault()}
            >
              <div>
                <label
                  htmlFor="newpass"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Enter a new password
                </label>
                <input
                  type="text"
                  id="newpass"
                  className="w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  placeholder="New Password"
                />
                <label
                  htmlFor="conpass"
                  className="mt-3 block text-sm mb-2 text-gray-300"
                >
                  Enter a confirm password
                </label>
                <input
                  type="text"
                  id="conpass"
                  className=" w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 transition py-2 rounded-md font-medium flex items-center justify-center"
                onClick={handleResetPassword}
              >
                {loading ? (
                  <ClipLoader size={20} color="black" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
            <div
              className="text-sm text-orange-400 text-center mt-4 cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Back to signIn
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ForgetPassword;
