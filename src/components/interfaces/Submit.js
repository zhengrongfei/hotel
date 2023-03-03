import { motion } from "framer-motion";
import classNames from "classnames";

import classes from "./Submit.module.css"
import { COLORS } from "../../constants/css";
import { ReloadIcon } from "../icons";

export const SUBMIT = {
  STATES: {
    DISABLED: "disabled",
    CLICK: "click",
    BUTTON: "button",
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error"
  }
}

function Submit({
                  id,
                  underlay = <ReloadIcon />,
                  width,
                  active = false,
                  layer = 2, // button component defaults to layer 2
                  preventDefault = true,
                  title,
                  description = "Submit",
                  state = SUBMIT.STATES.IDLE,
                  color,
                  onMouseDown,
                  onMouseUp,
                  onLeave,
                  className
                }) {
  return (
    <motion.button type="submit"
                   className={classNames(className, classes.submit)}
                   disabled={state === SUBMIT.STATES.DISABLED}
                   style={{ zIndex: layer, width: width, flexGrow: 1 }}
                   title={title}
      // css conditional styling
                   state={state}
                   active={active.toString()}
      // callback functions
                   onBlur={onLeave}
                   onClick={preventDefault && ((event) => event.preventDefault())}
                   onMouseDown={onMouseDown && ((...args) => onMouseDown(id, ...args))}
                   onMouseUp={onMouseUp && ((...args) => onMouseUp(id, ...args))}>
      <span className={classes.background}
            style={{ zIndex: layer, background: color }} />
      <div className={classes.underlay}
           style={{ zIndex: layer + 1 }}>
          <span className={classes.svg}>
            {underlay}
          </span>
      </div>
      <span className={classes.description}
            style={{ zIndex: layer + 2 }}>
        {description}
      </span>
    </motion.button>
  )
}

export default Submit;