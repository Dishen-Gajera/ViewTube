import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/getcurrentuser`,
          { withCredentials: true }
        );
        dispatch(setUserData(result.data));
        
      } catch (error) {
        console.log(error.response.data.message);
        dispatch(setUserData(null));
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
