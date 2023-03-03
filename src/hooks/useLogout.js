import axios from "../api/axios";
import useAuth from "./useAuth";
import { BREACKPOINTS } from "../constants/urls";

const useLogout = () => {
  const { setAuth } = useAuth();

  return async () => {
    setAuth({});
    try {
      await axios(BREACKPOINTS.LOGOUT, { withCredentials: true });
    } catch (error) {
      console.error(error);
    }
  };
}

export default useLogout