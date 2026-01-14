import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setAllShortsData, setAllVideosData } from "../Redux/contentSlice";

const useGetContentData = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/content/getallvideos`,
          { withCredentials: true }
        );
        dispatch(setAllVideosData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllVideos();
  }, [userData]);

  useEffect(() => {
    const getAllShorts = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/content/getallshorts`,
          { withCredentials: true }
        );
        dispatch(setAllShortsData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    getAllShorts();
  }, [userData]);
};

export default useGetContentData;
