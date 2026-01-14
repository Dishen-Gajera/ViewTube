import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
export const serverUrl =
  "view-tube-bq7r44hc6-dishen-gajeras-projects.vercel.app";
import CustomAlert, { showAlertHandler } from "./components/CustomAlert";
import Shorts from "./Pages/Shorts/Shorts";
import useGetCurrentUser from "./customHooks/useGetCurrentUser";
import MoblieProfile from "./components/MoblieProfile";
import ForgetPassword from "./Pages/ForgetPassword";
import CreateChannel from "./Pages/Channel/CreateChannel";
import ViewChannel from "./Pages/Channel/ViewChannel";
import useGetChannelData from "./customHooks/useGetChannelData";
import UpdateChannel from "./Pages/Channel/UpdateChannel";
import { useSelector } from "react-redux";
import CreatePage from "./Pages/CreatePage";
import CreateVideo from "./Pages/Videos/CreateVideo";
import CreateShort from "./Pages/Shorts/CreateShort";
import CreatePlaylist from "./Pages/Playlist/CreatePlaylist";
import CreatePost from "./Pages/Posts/CreatePost";
import useGetContentData from "./customHooks/useGetContentData";
import PlayVideo from "./Pages/Videos/PlayVideo";
import PlayShort from "./Pages/Shorts/PlayShort";
import ChannelPage from "./Pages/Channel/ChannelPage";
import LikedContent from "./Pages/LikedContent";
import SavedContent from "./Pages/SavedContent";
import SavedPlaylist from "./Pages/Playlist/SavedPlaylist";
import useGetsubscribedData from "./customHooks/useGetsubscribedData";
import Subscription from "./Pages/Subscription";
import useGetHistory from "./customHooks/useGetHistory";
import HistoryContent from "./Pages/HistoryContent";
import useGetRecommendedContent from "./customHooks/useGetRecommendedContent";
import VTStudio from "./Pages/VTStudio";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Content from "./components/Content";
import Revenue from "./components/Revenue";
import UpdateVideo from "./Pages/Videos/UpdateVideo";
import Updateshort from "./Pages/Shorts/UpdateShort";
import UpdatePlaylist from "./Pages/Playlist/UpdatePlaylist";

const ProctedRoute = ({ data, children, message, isSignIn }) => {
  if (!data) {
    showAlertHandler(message);
    return <Navigate to={isSignIn ? "/signin" : "/"} replace />;
  }
  return children;
};

function ChannelPageWrapper() {
  const location = useLocation();
  return <ChannelPage key={location.pathname} />;
}

function App() {
  useGetCurrentUser();
  useGetChannelData();
  useGetContentData();
  useGetsubscribedData();
  useGetHistory();
  useGetRecommendedContent();
  const { userData, channelData } = useSelector((state) => state.user);
  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="/shorts"
            element={
              <ProctedRoute
                data={userData}
                message={"Please SignIn first for use this features"}
              >
                <Shorts />
              </ProctedRoute>
            }
          />
          <Route
            path="/playshort/:shortId"
            element={
              <ProctedRoute
                data={userData}
                message={"Please Create Your Channel for use this features"}
              >
                <PlayShort />
              </ProctedRoute>
            }
          />
          <Route
            path="/mobilepro"
            element={
              <ProctedRoute
                data={userData}
                message={"Please SignIn first for use this features"}
                isSignIn={true}
              >
                <MoblieProfile />
              </ProctedRoute>
            }
          />
          <Route
            path="/viewchannel"
            element={
              <ProctedRoute
                data={channelData}
                message={"Please Create Your Channel for use this features"}
              >
                <ViewChannel />
              </ProctedRoute>
            }
          />
          <Route
            path="/updatechannel"
            element={
              <ProctedRoute
                data={channelData}
                message={"Please Create Your Channel for use this features"}
              >
                <UpdateChannel />
              </ProctedRoute>
            }
          />
          <Route
            path="/createpage"
            element={
              <ProctedRoute
                data={channelData}
                message={"Please Create Your Channel for use this features"}
              >
                <CreatePage />
              </ProctedRoute>
            }
          />
          <Route
            path="/createvideo"
            element={
              <ProctedRoute
                data={channelData}
                message={"Please Create Your Channel for use this features"}
              >
                <CreateVideo />
              </ProctedRoute>
            }
          />
          <Route
            path="/createshort"
            element={
              <ProctedRoute
                data={channelData}
                message={"Please Create Your Channel for use this features"}
              >
                <CreateShort />
              </ProctedRoute>
            }
          />
          <Route
            path="/createplaylist"
            element={
              <ProctedRoute
                data={channelData}
                message={"Please Create Your Channel for use this features"}
              >
                <CreatePlaylist />
              </ProctedRoute>
            }
          />
          <Route
            path="/createpost"
            element={
              <ProctedRoute
                data={channelData}
                message={"Please Create Your Channel for use this features"}
              >
                <CreatePost />
              </ProctedRoute>
            }
          />
          <Route
            path="/channelpage/:channelId"
            element={
              <ProctedRoute
                data={userData}
                message={"Please Create Your Account for use this features"}
              >
                <ChannelPageWrapper />
              </ProctedRoute>
            }
          />
          <Route
            path="/likedcontent"
            element={
              <ProctedRoute
                data={userData}
                message={"Please Create Your Account for use this features"}
              >
                <LikedContent />
              </ProctedRoute>
            }
          />
          <Route
            path="/savedcontent"
            element={
              <ProctedRoute
                data={userData}
                message={"Please Create Your Account for use this features"}
              >
                <SavedContent />
              </ProctedRoute>
            }
          />
          <Route
            path="/savedplaylists"
            element={
              <ProctedRoute
                data={userData}
                message={"Please Create Your Account for use this features"}
              >
                <SavedPlaylist />
              </ProctedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProctedRoute
                data={userData}
                message={"Please Create Your Account for use this features"}
              >
                <Subscription />
              </ProctedRoute>
            }
          />
          <Route
            path="/historycontent"
            element={
              <ProctedRoute
                data={userData}
                message={"Please SignIn first for use this features"}
              >
                <HistoryContent />
              </ProctedRoute>
            }
          />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route
          path="/createchannel"
          element={
            <ProctedRoute
              data={userData}
              message={"Please SignIn first for create Channel"}
            >
              <CreateChannel />
            </ProctedRoute>
          }
        />
        <Route
          path="playvideo/:videoId"
          element={
            <ProctedRoute
              data={userData}
              message={"For watch video please signIn first"}
            >
              <PlayVideo />
            </ProctedRoute>
          }
        />

        <Route
          path="/vtstudio"
          element={
            <ProctedRoute
              data={channelData}
              message={"Please create Channel First"}
            >
              <VTStudio />
            </ProctedRoute>
          }
        >
          <Route
            path="/vtstudio/dashboard"
            element={
              <ProctedRoute
                data={userData}
                message={"Plase create channel first"}
              >
                <Dashboard />
              </ProctedRoute>
            }
          />
          <Route
            path="/vtstudio/analytics"
            element={
              <ProctedRoute
                data={userData}
                message={"Plase create channel first"}
              >
                <Analytics />
              </ProctedRoute>
            }
          />
          <Route
            path="/vtstudio/content"
            element={
              <ProctedRoute
                data={userData}
                message={"Plase create channel first"}
              >
                <Content />
              </ProctedRoute>
            }
          />
          <Route
            path="/vtstudio/revenue"
            element={
              <ProctedRoute
                data={userData}
                message={"Plase create channel first"}
              >
                <Revenue />
              </ProctedRoute>
            }
          />
          <Route
            path="/vtstudio/updatevideo/:videoId"
            element={
              <ProctedRoute
                data={userData}
                message={"Plase create channel first"}
              >
                <UpdateVideo />
              </ProctedRoute>
            }
          />
          <Route
            path="/vtstudio/updateshort/:shortId"
            element={
              <ProctedRoute
                data={userData}
                message={"Plase create channel first"}
              >
                <Updateshort />
              </ProctedRoute>
            }
          />
          <Route
            path="/vtstudio/updateplaylist/:playlistId"
            element={
              <ProctedRoute
                data={userData}
                message={"Plase create channel first"}
              >
                <UpdatePlaylist />
              </ProctedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
