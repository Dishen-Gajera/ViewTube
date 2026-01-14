import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import {
  setSubscribedChannels,
  setSubscribedPlaylists,
  setSubscribedPosts,
  setSubscribedShorts,
  setSubscribedVideos,
} from "../Redux/userSlice";

function useGetsubscribedData() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchSubscribedData = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/subscribedcontent`,
          { withCredentials: true }
        );
        dispatch(setSubscribedChannels(result.data.subscribedChannels));
        dispatch(setSubscribedVideos(result.data.videos));
        dispatch(setSubscribedShorts(result.data.shorts));
        dispatch(setSubscribedPlaylists(result.data.playlists));
        dispatch(setSubscribedPosts(result.data.posts));
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubscribedData();
  }, [userData]);
}

export default useGetsubscribedData;
