import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showAlertHandler } from "./CustomAlert";
import { setUserData } from "../Redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      showAlertHandler("sign out sucessfully");
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error.data.response.message);
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
      console.log(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <div>
      <div className="absolute right-5 top-10 mt-3 w-72 bg-[#212121] text-white rounded-xl shodow-lg z-50 hidden md:block">
        {userData && (
          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <img
              src={userData?.photourl}
              alt=""
              className="w-12 h-12 flex items-center justify-center rounded-full object-cover border border-gray-700"
            />
            <div>
              <h4 className="font-semibold">{userData?.username}</h4>
              <p className="text-sm text-gray-400">{userData?.email}</p>
              <p
                className="text-sm text-blue-400 cursor-pointer hover:underline"
                onClick={() =>
                  userData?.channel
                    ? navigate("/viewchannel")
                    : navigate("/createchannel")
                }
              >
                {userData?.channel ? "view channel" : "create channel"}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col py-2">
          <button
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
            onClick={handelGoogleAuth}
          >
            {" "}
            <FcGoogle className="text-xl" />
            SignIn with google account
          </button>
          <button
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
            onClick={() => navigate("/signup")}
          >
            {" "}
            <TiUserAddOutline className="text-xl" />
            Create new Account
          </button>
          <button
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
            onClick={() => navigate("/signin")}
          >
            {" "}
            <MdOutlineSwitchAccount className="text-xl" />
            SignIn with other account
          </button>
          {userData?.channel && (
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={()=>navigate("/vtstudio/dashboard")}>
              {" "}
              <SiYoutubestudio className="w-5 h-5 text-orange-400" />
              VT Studio
            </button>
          )}
          {userData && (
            <button
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
              onClick={handleSignOut}
            >
              {" "}
              <FiLogOut className="text-xl" />
              Signout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
