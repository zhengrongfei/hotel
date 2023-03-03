import { createContext, useState } from "react";
import { DEFAULT_LANG } from "../constants/languages";

const defaultUser = {
  firstName: "Hyatt",
  lastName: "Hotel",
  avatar: false,
  language: DEFAULT_LANG.CODE,
  prefix: "",
  suffix: "",
  phone: "88080088",
  phoneCode: "+86",
  mail: "1088@sustech.edu.cn",
  birthday: new Date(),
  gender: "male",
  points: 1000000,
  country: "CN",
}

const UserContext = createContext({
  user: {
    firstName: "",
    lastName: "",
    avatar: false,
    language: DEFAULT_LANG.CODE,
    prefix: "",
    suffix: "",
    phone: "",
    phoneCode: "",
    mail: "",
    birthday: null,
    gender: "",
    points: 0,
    country: DEFAULT_LANG.COUNTRY_CODE,
  },
  setUser: () => {
  }
});

export const UserContextProvider = ({ children }) => {
  // const [userInfo, setUserInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(defaultUser); //TODO: null

  const context = {
    user: userInfo,
    setUser: setUserInfo
  }

  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;