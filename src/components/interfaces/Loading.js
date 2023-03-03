import { useTranslation } from "react-i18next";
import classes from "./Loading.module.css";

function Loading() {
  const { t } = useTranslation();
  return (
    <div className={classes.loading}>
    </div>
  )
}

export default Loading