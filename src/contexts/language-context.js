import { createContext, useState } from "react";
import i18next from "i18next"
import cookies from "js-cookie"

import { DEFAULT_LANG, LANGUAGES } from "../constants/languages";
import { COOKIE_NAMES } from "../constants/cookie-names";
import { THRESHOLD } from "../constants/threshold";

const LanguageContext = createContext({
  currentLanguageCode: DEFAULT_LANG.CODE,
  currentLanguage: {},
  currentLocale: {},
  languageAdjustmentCount: 0,
  languageAdjustmentError: false,
  changeLanguage: (code) => {
  },
});

export function LanguageContextProvider(props) {
  const [userLanguageCode, setUserLanguageCode] = useState(cookies.get(COOKIE_NAMES.LANG) || DEFAULT_LANG.CODE);
  const [userLanguage, setUserLanguage] = useState(LANGUAGES.find((L) => L.CODE === userLanguageCode));
  const [userLocale, setUserLocale] = useState(DEFAULT_LANG.LOCALE);
  const [userAdjustmentCount, setUserAdjustmentCount] = useState(0);
  const [userAdjustmentError, setUserAdjustmentError] = useState(false);

  let language;

  function changeLanguageHandler(code) {
    if ((language = LANGUAGES.find((L) => L.CODE === code))
      && userAdjustmentCount !== THRESHOLD.LANG_ADJUSTMENT_LIMIT)
      i18next.changeLanguage(code).then(() => {
        setUserLanguageCode(code);
        setUserLanguage(language);
        setUserLocale(language.LOCALE);
        setUserAdjustmentCount(prevAdjustmentCount => {
          return prevAdjustmentCount++;
        })
      })
    else
      setUserAdjustmentError(true);
  }

  const context = {
    currentLanguageCode: userLanguageCode,
    currentLanguage: userLanguage,
    currentLocale: userLocale,
    languageAdjustmentCount: userAdjustmentCount,
    languageAdjustmentError: userAdjustmentError,
    changeLanguage: changeLanguageHandler
  };

  return (
    <LanguageContext.Provider value={context}>
      {props.children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;