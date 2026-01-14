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

function CreateChannel() {
  const [step, setStep] = useState(1);
  const [avatar, setAvater] = useState(null);
  const [banner, setBanner] = useState(null);

  const { userData } = useSelector((state) => state.user);
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
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

  const handleCreateChannel = async () => {
    try {
      setloading(true);
      const formData = new FormData();
      formData.append("name", channelName);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("avatar", avatar);
      formData.append("banner", banner);
      const result = await axios.post(
        `${serverUrl}/api/user/createchannel`,
        formData,
        { withCredentials: true }
      );
      console.log(result.data);
      setloading(false);
      showAlertHandler("Channel created successfully");
      navigate("/");
      dispatch(setChannelData(result.data));
      dispatch(setUserData(result.data.owner));
    } catch (error) {
      console.log(error);
      setloading(false);
      showAlertHandler(error.response.data.message);
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="w-8 h-8 object-cover" />
          <span className="text-white font-bold text-xl tracking-tight font-roboto">
            ViewTube
          </span>
        </div>
        <div className="flex items-center gap-3">
          <img
            src={userData?.photourl}
            alt=""
            className="rounded-full w-9 h-9 object-cover"
          />
        </div>
      </header>

      {/* main area */}
      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-lg shadow-lg">
          {step == 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">how you'll appear</h2>
              <p className="text-sm text-gray-400 mb-6">
                choose your profile picture , Channel name
              </p>

              <div className="flex flex-col items-center mb-6">
                <label
                  htmlFor="avatar"
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => {}}
                >
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      className="w-20 aspect-square rounded-full object-cover border-2 border-gray-600"
                    />
                  ) : (
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
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      className="h-20 w-20 rounded-full object-cover border-2 border-gray-600"
                    />
                  ) : (
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
                Continue and Create Channel
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
                  {banner ? (
                    <img
                      src={URL.createObjectURL(banner)}
                      className="w-full h-32 object-cover border mb-2 rounded-lg border-gray-700"
                    />
                  ) : (
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
                disabled={!description || !category}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 transition py-3 rounded-lg font-medium disabled:bg-gray-600"
                onClick={handleCreateChannel}
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  "Save and Create Channel"
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

export default CreateChannel;
