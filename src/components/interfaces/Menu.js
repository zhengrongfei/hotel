import classes from "./Menu.module.css";
import { cloneElement, forwardRef, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { EASE, DURATION, LAYERS, LENGTHS, SHADOWS } from "../../constants/css";

const Menu = forwardRef(({
                           children,
                           activator,
                           className,
                           expand = false,
                           layer = LAYERS.MENU_AND_BUTTON,
                           centered = false,
                           style,
                           finalWidth
                         }, ref) => {
  const activatorRef = useRef();
  const usedRef = ref || activatorRef;
  const [activatorWidth, setActivatorWidth] = useState(LENGTHS.UNIT_LENGTH);

  useEffect(() => {
    setActivatorWidth(usedRef.current.clientWidth);
  }, []);

  return (
    <div className={classes.parent} style={style}>
      {cloneElement(activator, { ref: usedRef })}
      <motion.div className={classNames(classes.viewport, className)}
                  initial={false}
                  animate={expand
                    ? { width: finalWidth || "auto", height: "auto", boxShadow: SHADOWS.MENU, opacity: 1 }
                    : { width: activatorWidth, height: 1, boxShadow: SHADOWS.NONE, opacity: 0 }}
                  transition={{
                    duration: DURATION.SLOW,
                    ease: EASE.NORMAL,
                    opacity: { duration: 0.1, delay: expand ? 0 : 0.4 }
                  }}
                  style={centered ? {
                    zIndex: layer,
                    left: "50%",
                    translateX: "-50%"
                  } : { zIndex: layer }}>
        <div className={classes.background} />
        {children}
      </motion.div>
    </div>
  )
});

export default Menu