import classes from "./Button.module.css"
import { MissingIcon } from "../icons";

function IconHolder({
                      icon = <MissingIcon />,
                    }) {

  return (
    <div className={classes.icon}>
      {icon}
    </div>
  )
}

export default IconHolder;