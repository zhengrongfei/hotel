import classes from "./Button.module.css"
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";
import { CancelIcon, RadioIcon, RadioInsetIcon } from "../icons";
import { ALIGNMENT, EASE, DURATION, LAYERS, LENGTHS } from "../../constants/css";
import React from "react";

export const BUTTON = {
  TYPES: {
    // clickable button
    CLICK: "click",
    // menu button with cancel
    MENU: "menu",
    // highlighted upon selection
    VALUE: "value",
    // default to radio
    SELECTION: "selection",
    // grayed out button
    INACTIVE: "inactive",
    // colored upon selection
    OPTION: "option",
    // empty placeholder
    DISABLED: "disabled"
  },
  POSITION: {
    LEFT: { translateX: "-100%", position: "absolute", left: 0 },
    RIGHT: { translateX: "100%", position: "absolute", right: 0 },
    TOP: { translateY: "-100%", position: "absolute", top: 0 },
    BOTTOM: { translateY: "100%", position: "absolute", bottom: 0 },
    DEFAULT: {}
  },
  CONTENT: {
    TEXT: {
      marginLeft: LENGTHS.TEXT_MARGIN,
      marginRight: LENGTHS.TEXT_MARGIN
    },
    ADJACENT: {},
    DEFAULT: {
      marginRight: LENGTHS.TEXT_MARGIN
    }
  }
}

const Button = React.forwardRef(({
                                   id,
                                   icon,
                                   iconDescription,                     // part of the button
                                   content = BUTTON.CONTENT.DEFAULT,
                                   underlay,
                                   underlayDescription,                 // part of the underlay
                                   description,                         // will not react to hover
                                   layoutId,
                                   multiMenu = false,
                                   indent = 0,
                                   position = BUTTON.POSITION.DEFAULT,
                                   title,
                                   width,
                                   expand = true,
                                   type = BUTTON.TYPES.CLICK,
                                   active = false,
                                   alignment = ALIGNMENT.LEFT,
                                   layer = LAYERS.MENU_AND_BUTTON,
                                   submit = false,
                                   onLeave,
                                   onEnter,
                                   onMouseDown,
                                   onMouseUp,
                                   onClick,
                                   className
                                 }, ref) => {
  // defaults
  if (!underlay) switch (type) {
    case BUTTON.TYPES.MENU:
      underlay = <CancelIcon />;
      break;
    case BUTTON.TYPES.SELECTION:
      underlay = <RadioInsetIcon />;
      break;
    default:
      break;
  }
  if (!icon) switch (type) {
    case BUTTON.TYPES.DISABLED:
      icon = " ";
      break;
    case BUTTON.TYPES.SELECTION:
      icon = <RadioIcon />;
      break;
  }

  return (
    <motion.button type={submit ? "submit" : "button"}
                   className={classNames(className, classes.button)}
                   disabled={type === BUTTON.TYPES.DISABLED}
                   style={{
                     zIndex: layer, width: width, justifyContent: alignment,
                     paddingLeft: indent * LENGTHS.UNIT_LENGTH,
                     ...position
                   }}
                   title={title}
                   ref={ref}
      // motion animation
                   initial={false}
                   animate={{
                     width: expand ? width || "fit-content" : 0,
                     overflow: expand ? "visible" : "hidden"
                   }}
                   transition={{
                     duration: DURATION.SLOW, ease: "easeInOut",
                     overflow: { delay: expand ? DURATION.SLOW : 0 }
                   }}
      // css conditional styling
                   varient={type}
                   active={active.toString()}
      // callback functions
                   onBlur={onLeave && ((...args) => onLeave(id, ...args))}
                   onMouseDown={onMouseDown && ((...args) => onMouseDown(id, ...args))}
                   onMouseUp={onMouseUp && ((...args) => onMouseUp(id, ...args))}
                   onMouseLeave={onLeave}
                   onClick={onClick && ((...args) => onClick(id, ...args))}
                   onMouseEnter={onEnter}>
      {type === BUTTON.TYPES.VALUE &&
        <span className={classes.background}
              style={{ zIndex: layer }} />
      }
      {multiMenu &&
        <motion.div className={classes.indicator}
                    layout
                    layoutId={layoutId}
                    style={{ zIndex: layer + 1 }} />
      }
      {(type === BUTTON.TYPES.MENU || type === BUTTON.TYPES.SELECTION) &&
        <div className={classes.underlay}
             style={{ zIndex: layer + 1 }}>
          <span className={classes.svg}>
            {underlay}
          </span>
          {underlayDescription &&
            <span className={classes.description}
                  style={content}>
              {underlayDescription}
            </span>
          }
        </div>
      }
      <div className={classes.icon}
           style={{ zIndex: layer + 2 }}>
        {icon &&
          <span className={classes.svg}>
            {icon}
          </span>
        }
        {iconDescription &&
          <span className={classes.description}
                style={content}>
            {iconDescription}
          </span>
        }
      </div>
      {description &&
        <div className={classes.description}
             style={content}>
          {description}
        </div>
      }
    </motion.button>
  )
});

export default Button;