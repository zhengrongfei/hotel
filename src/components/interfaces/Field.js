import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";

import classes from "./Field.module.css"
import { COLORS, DURATION, EASE, LENGTHS } from "../../constants/css";

export const FIELD = {
  TYPES: {
    TEXT: "text",
    TIME: "time",
    NUMBER: "number",
    PASSWORD: "password"
  },
  ALIGN: {
    DEFAULT: {
      field: {},
      input: { marginLeft: LENGTHS.TEXT_MARGIN }
    },
    CENTER: {
      field: { display: "flex", justifyContent: "center" },
      input: { textAlign: "center" }
    }
  },
  STATES: {
    DISABLED: "disabled",
    DISPLAY: "display",
    IDLE: "idle",
    PROGRESS: "progress",
    ACTIVE: "active",
    SUCCESS: "success",
    ERROR: "error"
  },
  DIVIDER: {
    TOP: {
      borderTop: "1px solid",
      borderColor: COLORS.GRAY_LIGHT
    },
    RIGHT: {
      borderRight: "1px solid",
      borderColor: COLORS.GRAY_LIGHT
    }
  }
}

function Field({
                 // enable = true,
                 icon,
                 name,
                 caption,
                 placeholder,
                 defaultValue,
                 displayValue,
                 width,
                 type = FIELD.TYPES.TEXT,
                 state = FIELD.STATES.IDLE,
                 align = FIELD.ALIGN.DEFAULT,
                 divider,
                 attribute,                         // an error or progress bar percentage
                 min, max,
                 defaultFocus = false,
                 onChange,
                 onLeave,
                 onSelect,
                 className
               }) {
  return (
    <div className={classNames(classes.field_wrapper, className)}
         style={{ width: type === FIELD.TYPES.NUMBER ? `${LENGTHS.UNIT_LENGTH}px` : width }}
      // css conditional styling
         state={state}>
      {caption && <span className={classes.caption}>{caption}</span>}
      <div className={classes.field} key={caption + defaultValue}
           style={{ ...align.field, ...divider }}>
        {icon &&
          <div className={classes.icon}>
            {icon}
          </div>}
        <input className={classes.input}
               disabled={state === FIELD.STATES.DISABLED}
               type={type}
               name={name}
               readOnly={state === FIELD.STATES.DISPLAY}
               tabIndex={state === FIELD.STATES.DISPLAY ? -1 : null}
               autoFocus={defaultFocus}
               placeholder={placeholder}
               defaultValue={defaultValue}
               value={displayValue}
               min={min || defaultValue}
               max={max}
               style={icon
                 ? { marginRight: LENGTHS.TEXT_MARGIN }
                 : align.input}
          // callback functions
               onBlur={onLeave}
               onSelect={onSelect}
               onChange={onChange} />
      </div>
      {state === FIELD.STATES.PROGRESS &&
        <>
          <div className={classes.percent_track} />
          <div className={classes.percent_thumb} />
        </>}
      <AnimatePresence initial={false}>
        {state === FIELD.STATES.ERROR &&
          <motion.div className={classes.error}
                      initial={{ height: 0 }}
                      animate={{ height: "fit-content" }}
                      exit={{ height: 0 }}
                      transition={{
                        duration: DURATION.FAST,
                        ease: EASE.EASE_OUT
                      }}>
            {attribute}
          </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default Field;