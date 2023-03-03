import classes from "./Dropdown.module.css";
import { motion } from "framer-motion";

import { EASE, COLORS, DURATION, LAYERS } from "../../constants/css";
import ScrollBox from "./ScrollBox";

function Dropdown({
                    expand = false,
                    vertical = true,
                    layer = LAYERS.OVERLAY,
                    size = "100%",
                    background = COLORS.GRAY_LIGHT,
                    children
                  }) {
  return (
    <motion.div className={classes.background}
                style={{
                  ...(vertical ? { width: size } : { height: size }),
                  ...{
                    zIndex: layer,
                    background: background
                  }
                }}
                initial={false}
                animate={
                  vertical
                    ? { height: expand ? size : 0 }
                    : { width: expand ? size : 0 }
                }
                transition={{
                  ease: EASE.NORMAL,
                  duration: DURATION.SLOW
                }}>
      <ScrollBox layer={layer}>
        {children}
      </ScrollBox>
    </motion.div>
  );
}

export default Dropdown;