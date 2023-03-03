import { useContext } from "react";
import LanguageContext from "../contexts/language-context";
import { format } from "date-fns";

const useFormat = () => {
  const userLanguageContext = useContext(LanguageContext);
  return {
    format: (date, outputFormat) => {
      return format(
        date,
        outputFormat,
        { locale: userLanguageContext.currentLocale }
      )
    },
    locale: userLanguageContext.currentLocale
  }
}

export default useFormat;