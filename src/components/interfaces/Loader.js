import { useTranslation } from "react-i18next";
import classes from "./Loader.module.css";
import { useState } from "react";

function Loader(
  treshold,
  vertical = false,
) {
  const { t } = useTranslation();

  const [size, setSize] = useState(0);

  console.log(window.scrollX)

  return (
    <div className={classes.container} style={{
      width: `${10}px`
    }}>
    </div>
  )
}

export default Loader