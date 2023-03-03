import { useEffect } from "react";

import useRefresh from "./useRefresh";
import useAuth from "./useAuth";
import { axiosAuth } from "../api/axios";
import { ERROR } from "../constants/http";

const useAxios = () => {
  const refresh = useRefresh();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      config => {
        if (!config.headers["Authorization"]) // first attempt
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        return config;
      }, (error) => Promise.reject(error)
    );
    const responseIntercept = axiosAuth.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === ERROR.TOKEN_EXPIRED && !prevRequest?.sent) {
          prevRequest.sent = true; // the interceptor only runs for once
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; // update access token
          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    }
  }, [auth, refresh])

  return axiosAuth;
}

export default useAxios;