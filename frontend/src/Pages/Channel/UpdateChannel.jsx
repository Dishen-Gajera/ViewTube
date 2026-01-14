import React, { useState } from "react";
import logo from "../../assets/viewtube.png";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showAlertHandler } from "../../components/CustomAlert";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { setChannelData, setUserData } from "../../Redux/userSlice";

function UpdateChannel() {
  const { channelData } = useSelector((state) => state.user);
  const [step, setStep] = useState(1);
  const [avatar, setAvater] = useState();
  const [banner, setBanner] = useState(null);

  const [channelName, setChannelName] = useState(channelData?.name);
  const [description, setDescription] = useState(channelData?.description);
  const [category, setCategory] = useState(channelData?.category);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleAvatar = (e) => {
    setAvater(e.target.files[0]);
  };
  const handlebanner = (e) => {
    setBanner(e.target.files[0]);
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleUpdateChannel = async () => {
    try {
      const formData = new FormData();
      formData.append("name", channelName);
      formData.append("description", description);
      formData.append("category", category);
      if (avatar) {
        formData.append("avatar", avatar);
      }
      if (banner) {
        formData.append("banner", banner);
      }
      setloading(true);
      const result = await axios.post(
        `${serverUrl}/api/user/updatechannel`,
        formData,
        { withCredentials: true }
      );
      setloading(false);
      showAlertHandler("channel updated successfully");
      dispatch(setChannelData(result.data));
      dispatch(setUserData(result.data.owner));
      navigate("/");
    } catch (error) {
      setloading(false);
      console.log(error);
      showAlertHandler(error.rseponse.data.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      {/* main area */}
      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-lg shadow-lg">
          {step == 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Customize Channel</h2>
              <p className="text-sm text-gray-400 mb-6">
                Customize your profile picture , Channel name
              </p>

              <div className="flex flex-col items-center mb-6">
                <label
                  htmlFor="avatar"
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => {}}
                >
                  {!avatar && channelData?.avatar && (
                    <img
                      src={channelData?.avatar}
                      className="w-20 aspect-square rounded-full object-cover border-2 border-gray-600"
                    />
                  )}
                  {avatar && (
                    <img
                      src={URL.createObjectURL(avatar)}
                      className="w-20 aspect-square rounded-full object-cover border-2 border-gray-600"
                    />
                  )}
                  {!avatar && !channelData?.avatar && (
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                      <FaUserCircle size={40} />
                    </div>
                  )}
                  <span className="text-orange-400 text-sm mt-2">
                    Upload Avatar
                  </span>
                  <input
                    type="file"
                    name=""
                    id="avatar"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatar}
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="Channel Name"
                className="w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
              />
              <button
                disabled={!channelName}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 transition py-3 rounded-lg font-medium disabled:bg-gray-600"
                onClick={nextStep}
              >
                Continue
              </button>
              <span
                className="w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline mt-2"
                onClick={() => navigate("/")}
              >
                Back to home
              </span>
            </div>
          )}

          {/* step2 */}

          {step == 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Channel</h2>

              <div className="flex flex-col items-center mb-6">
                <label
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => {}}
                >
                  {!avatar && channelData?.avatar && (
                    <img
                      src={channelData?.avatar}
                      className="w-20 aspect-square rounded-full object-cover border-2 border-gray-600"
                    />
                  )}
                  {avatar && (
                    <img
                      src={URL.createObjectURL(avatar)}
                      className="w-20 aspect-square rounded-full object-cover border-2 border-gray-600"
                    />
                  )}
                  {!avatar && !channelData?.avatar && (
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                      <FaUserCircle size={40} />
                    </div>
                  )}
                </label>
                <h2 className="mt-3 text-lg font-semibold">{channelName}</h2>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 bg-orange-600 transition py-3 rounded-lg font-medium disabled:bg-gray-600"
                onClick={nextStep}
              >
                Continue and Customize Channel
              </button>
              <span
                className="w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline mt-2"
                onClick={prevStep}
              >
                Back
              </span>
            </div>
          )}

          {/* step 3 */}
          {step == 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Create Channel</h2>

              <div className="flex flex-col mb-6">
                <label
                  htmlFor="banner"
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => {}}
                >
                  {!banner && channelData?.banner && (
                    <img
                      src={channelData?.banner}
                      className="w-full h-32 object-cover border mb-2 rounded-lg border-gray-700"
                    />
                  )}
                  {banner && (
                    <img
                      src={URL.createObjectURL(banner)}
                      className="w-full h-32 object-cover border mb-2 rounded-lg border-gray-700"
                    />
                  )}
                  {!banner && !channelData?.banner && (
                    <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-400 mb-2">
                      Click to upload bannerImage
                    </div>
                  )}

                  <span className="text-orange-400 text-sm mt-2">
                    Upload Banner
                  </span>
                  <input
                    type="file"
                    name=""
                    id="banner"
                    className="hidden"
                    accept="image/*"
                    onChange={handlebanner}
                  />
                </label>
              </div>

              <textarea
                name=""
                id=""
                className="w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 hide-scrollbar"
                placeholder="Channed description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              <input
                type="text"
                placeholder="Channel Category"
                className="w-full p-3 mb-6 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              />
              <button
                disabled={!description || !category || loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 transition py-3 rounded-lg font-medium disabled:bg-gray-600"
                onClick={handleUpdateChannel}
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  "Save and Customize Channel"
                )}
              </button>
              <span
                className="w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline mt-2"
                onClick={prevStep}
              >
                Back
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UpdateChannel;
