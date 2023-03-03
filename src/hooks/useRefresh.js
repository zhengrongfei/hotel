import axios from "../api/axios";
import useAuth from "./useAuth";
import { BREACKPOINTS } from "../constants/urls";

const useRefresh = () => {
  const { setAuth } = useAuth();

  return async () => {
    // using request token to get a new access token
    const response = await axios.get(BREACKPOINTS.REFRESH, {
      withCredentials: true
    });
    setAuth(prev => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return {
        ...prev,
        roles: response.data.roles,
        label: response.data.label,
        accessToken: response.data.accessToken
      }
    });
    return response.data.accessToken;
  };
};

export default useRefresh;
