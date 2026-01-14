import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";

import { FaHistory, FaList, FaThumbsUp } from "react-icons/fa";
import { GoVideo } from "react-icons/go";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../Redux/userSlice";
import { showAlertHandler } from "./CustomAlert";
import { serverUrl } from "../App";
import axios from "axios";

function MoblieProfile() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div className="md:hidden bg-[#0f0f0f] text-white h-full w-full flex flex-col pt-10 p-2.5">
      {/* top profile section */}
      {userData && (
        <div className="p-4 flex items-center gap-4 border-b border-gray-800">
          {userData?.photourl && (
            <img
              src={userData?.photourl}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{userData?.username}</span>
            <span className="text-gray-400 text-sm">{userData?.email}</span>
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

      {/* auth buttons */}
      <div className="flex gap-2 p-4 border-b border-gray-800 overflow-auto hide-scrollbar">
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={handelGoogleAuth}
        >
          <FcGoogle className="text-xl" />
          SignIn with Google account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={() => navigate("/signup")}
        >
          <TiUserAddOutline className="text-xl" />
          Create new Account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={() => navigate("/signin")}
        >
          <MdOutlineSwitchAccount className="text-xl" />
          SignIn with your account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={handleSignOut}
        >
          <FiLogOut className="text-xl" />
          SignOut
        </button>
      </div>
      <div className="flex flex-col mt-5">
        <ProfileMenuItem
          icon={<FaHistory />}
          text={"history"}
          onClick={() => navigate("/historycontent")}
        />
        <ProfileMenuItem
          icon={<FaList />}
          text={"Playlists"}
          onClick={() => navigate("/savedplaylists")}
        />
        <ProfileMenuItem
          icon={<GoVideo />}
          text={"Save Videos"}
          onClick={() => navigate("/savedcontent")}
        />
        <ProfileMenuItem
          icon={<FaThumbsUp />}
          text={"Liked Videos"}
          onClick={() => navigate("/likedcontent")}
        />
        <ProfileMenuItem
          icon={<SiYoutubestudio className="text-orange-400" />}
          text={"PT Studio"}
          onClick={()=>navigate("/vtstudio/dashboard")}
        />
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon, text, onClick }) {
  return (
    <button
      className="w-full rounded-2xl flex items-center gap-3 p-4 active:bg-[#272727] text-left"
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
}

export default MoblieProfile;
