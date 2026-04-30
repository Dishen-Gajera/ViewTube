import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/viewtube.png";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { showAlertHandler } from "../components/CustomAlert";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/userSlice";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";



function SignIn() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (step == 1) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        showAlertHandler("email is not valid");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleSignIn = async () => {
    if (!password) {
      showAlertHandler("please enter password");
      return;
    }
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      navigate("/");
      setLoading(false);
    } catch (error) {
      showAlertHandler(error.response.data.message);
      setLoading(false);
    }
  };

  const handelGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
      const user = response.user;
      const formData = new FormData();
      formData.append("username", user.displayName);
      formData.append("email", user.email);
      formData.append("photourl", user.photoURL);

      const result = await axios.post(
        `${serverUrl}/api/auth/googleauth`,
        formData,
        { withCredentials: true }
      );
      showAlertHandler("signin with google sucessfully");
      dispatch(setUserData(result.data));
      navigate("/")
    } catch (error) {
      console.log(error?.response?.data?.message);


      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#181818]">
      <div className="bg-[#202124] rounded-2xl p-10 w-full max-w-md shadow-lg">
        <div className="flex item-center mb-6">
          <button
            className="text-gray-300 mr-3 hover:text-white"
            onClick={() => {
              if (step > 1) {
                setStep((prev) => prev - 1);
              } else {
                navigate("/");
              }
            }}
          >
            <FaArrowLeft size={20} />
          </button>
          <span className="text-white text-2xl font-medium">View Tube</span>
        </div>

        {step == 1 && (
          <>
            <h1 className="text-3xl font-normal text-white flex items-center gap-2 mb-5">
              <img src={logo} alt="logo" className="w-8 h-8" />
              SignIn
            </h1>
            <p className="text-gray-400 mb-6 text-sm ">
              With Your Account To ViewTube
            </p>
            <input
              type="email"
              placeholder="email"
              className="w-full bg-transparent border-gray-500 border rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <div className="flex justify-between items-center">
              <button
                className="text-orange-400 text-sm hover:underline"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
            <div className="flex items-center justify-center w-full mt-3">
              <button
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handelGoogleAuth}
              >
                {" "}
                <FcGoogle className="text-xl" />
                SignIn with google account
              </button>

            </div>
          </>
        )}
        {step == 2 && (
          <>
            <h1 className="text-3xl font-normal text-white flex items-center gap-2 mb-5">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Welcome
            </h1>
            <div className="flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-6">
              <FaUserCircle className="mr-2" size={20} />
              {email}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent border-gray-500 border rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-3"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                name=""
                id="showpass"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
              />
              <label
                htmlFor="showpass"
                className="text-gray-300 cursor-pointer"
              >
                show password
              </label>
            </div>
            <div className="flex justify-between items-center">
              <button className="text-orange-400 text-sm hover:underline" onClick={() => navigate('/forgetpass')}>
                Forgot Password
              </button>
              <button
                className="flex bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full items-center"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? <ClipLoader color="black" size={20} /> : "SignIn"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SignIn;
