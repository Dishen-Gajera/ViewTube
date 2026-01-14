import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setRecommendedContent } from "../Redux/userSlice";

function useGetRecommendedContent() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchrecommendedContent = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/recommendation`, {
          withCredentials: true,
        });
        dispatch(setRecommendedContent(result.data));
        console.log(result.data);
      } catch (error) {
        console.log(error);
        dispatch(setRecommendedContent(null));
      }
    };
    fetchrecommendedContent();
  }, [userData]);
}

export default useGetRecommendedContent;
