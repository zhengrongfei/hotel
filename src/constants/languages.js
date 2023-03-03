import { arSA, enUS, fr, zhCN } from "date-fns/locale";

export const LANGUAGES = [
  {
    CODE: "en",
    NAME: "English",
    COUNTRY_CODE: "US",
    LOCALE: enUS
  },
  {
    CODE: "zh",
    NAME: "中文",
    COUNTRY_CODE: "CN",
    LOCALE: zhCN
  },
  {
    CODE: "fr",
    NAME: "Français",
    COUNTRY_CODE: "FR",
    LOCALE: fr
  },
  {
    CODE: "ar",
    NAME: "العربية",
    DIRECTION: "rtl",
    COUNTRY_CODE: "SA",
    LOCALE: arSA
  },
]

export const DEFAULT_LANG = LANGUAGES[0];
