import { useContext, useDebugValue } from "react";
import AuthContext from "../contexts/auth-context";
import { ROLES } from "../constants/users";

const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, auth => auth.role !== ROLES.NONE ? "Logged In" : "Logged Out")
  return useContext(AuthContext);
}

export default useAuth;