import { createContext, useState } from "react";
import { ROLES } from "../constants/users";
import { COOKIE_NAMES } from "../constants/cookie-names";

const AuthContext = createContext({
  auth: {
    role: ROLES.NONE,
    label: 0,
    accessToken: 0
  },
  setAuth: () => {},
  persist: false,
  setPersist: () => {}
});

export const AuthContextProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState({
    role: ROLES.NONE,
    label: 0,
    accessToken: 0
  });
  const [userPersist, setUserPersist] = useState(
    JSON.parse(localStorage.getItem(COOKIE_NAMES.PERSIST))
    || false
  );

  const context = {
    auth: userAuth,
    setAuth: setUserAuth,
    persist: userPersist,
    setPersist: setUserPersist
  }

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;