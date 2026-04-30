import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/viewtube.png";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { showAlertHandler } from "../components/CustomAlert";
import { setUserData } from "../Redux/userSlice";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../../utils/firebase";



function SignUp() {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setEConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setfrontendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setfrontendImage(URL.createObjectURL(file));
  };

  const handleNext = () => {
    if (step == 1) {
      if (!userName || !email) {
        showAlertHandler("fill all the fields");
        return;
      }
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email.trim())) {
        showAlertHandler("email is not valid");
        return;
      }
    }
    if (step == 2) {
      if (!password || !confirmPassword) {
        showAlertHandler("fill all the fields");
        return;
      }
      if (password !== confirmPassword) {
        showAlertHandler("password and confirm passwor not match");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleSignUp = async () => {
    if (!backendImage) {
      showAlertHandler("please choose profileimagee");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("username", userName);
    formData.append("email", email.trim());
    formData.append("password", password);
    formData.append("photourl", backendImage);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        formData,
        {
          withCredentials: true,
        }
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
          <span className="text-white text-2xl font-medium">Crete Account</span>
        </div>

        {step == 1 && (
          <>
            <h1 className="text-3xl font-normal text-white flex items-center gap-2 mb-5">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Basic Info
            </h1>
            <input
              type="text"
              placeholder="username"
              className="w-full bg-transparent border-gray-500 border rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-3"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
            <input
              type="email"
              placeholder="email"
              className="w-full bg-transparent border-gray-500 border rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <div className="flex justify-end">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
            <button
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-white mt-2"
              onClick={handelGoogleAuth}
            >
              {" "}
              <FcGoogle className="text-xl" />
              SignIn with google account
            </button>
          </>
        )}
        {step == 2 && (
          <>
            <h1 className="text-3xl font-normal text-white flex items-center gap-2 mb-5">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Security
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
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full bg-transparent border-gray-500 border rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500"
              onChange={(e) => setEConfirmPassword(e.target.value)}
              value={confirmPassword}
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
            <div className="flex justify-end">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </>
        )}
        {step == 3 && (
          <>
            <h1 className="text-3xl font-normal text-white flex items-center gap-2 mb-5">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Choose Avtar
            </h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="lg:w-28 md:w-28 w-40 rounded-full aspect-square border-4 border-gray-500 overflow-hidden shadow-lg">
                {frontendImage ? (
                  <img
                    src={frontendImage}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaUserCircle className="text-gray-500 w-full h-full rounded-full p-2" />
                )}
              </div>

              <div className="flex flex-col gap-2 ">
                <label htmlFor="" className="text-gray-300 font-medium">
                  Chose Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name=""
                  id=""
                  className="block w-full text-sm text-gray-400 
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full
                  file:text-sm file:font-semibold
                  file:bg-orange-600 file:text-white
                  hover:file:bg-orange-700 cursor-pointer
                  "
                  onChange={handleImage}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center"
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUp;
