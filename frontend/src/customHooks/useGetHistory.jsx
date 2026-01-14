import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShortHistory, setVideoHistory } from "../Redux/userSlice";

function useGetHistory() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const gethistorty = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/gethistory`, {
          withCredentials: true,
        });
        const history = result.data;
        const videos = history.filter((v) => v.contenttype === "Video");
        const shorts = history.filter((v) => v.contenttype === "Short");

        dispatch(setVideoHistory(videos));
        dispatch(setShortHistory(shorts));
        console.log(result);
      } catch (error) {
        console.log(error);
        dispatch(setVideoHistory(null));
        dispatch(setShortHistory(null));
      }
    };
    gethistorty();
  }, [userData]);
}

export default useGetHistory;
