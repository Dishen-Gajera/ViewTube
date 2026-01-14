import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setAllChannelData, setChannelData } from "../Redux/userSlice";

function useGetChannelData() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/getchannel`, {
          withCredentials: true,
        });
        dispatch(setChannelData(result.data));
      } catch (error) {
        console.log(error.response.data.message);
        dispatch(setChannelData(null));
      }
    };
    fetchChannel();
  }, [userData]);

  useEffect(() => {
    const getAllChannel = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/getallchannels`, {
          withCredentials: true,
        });
        dispatch(setAllChannelData(result.data));
      } catch (error) {
        console.log(error.response.data.message);
        dispatch(setAllChannelData(null));
      }
    };
    getAllChannel();
  }, [userData]);
}

export default useGetChannelData;
