import classes from "./Success.module.css";
import { LargeTickIcon } from "../icons";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

function Success({ className }) {
  const { t } = useTranslation();
  return (
    <div className={classNames(classes.success, className)}>
      <LargeTickIcon />
      <header>{t("operation_success")}</header>
    </div>
  );
}

export default Success;