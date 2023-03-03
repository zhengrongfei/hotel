import { EASE, DURATION } from "../../constants/css";
import classes from "./Expander.module.css";
import { AnimatePresence, motion } from "framer-motion";

function Expander({
                    render = false,
                    children
                  }) {
  return (
    <AnimatePresence initial={false}>
      {render &&
        <motion.div style={{ overflow: "hidden", width: "100%" }}
                    key={children}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{
                      ease: EASE.NORMAL,
                      duration: DURATION.SLOW
                    }}>
          {children}
        </motion.div>
      }
    </AnimatePresence>
  );
}

export default Expander;