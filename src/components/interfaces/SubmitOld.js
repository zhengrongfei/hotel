import classes from "./SubmitOld.module.css"
import { motion } from "framer-motion";
import classNames from "classnames";
import { Fragment } from "react";


function SubmitOld({
                  id,
                  enable = true,
                  preventDefault = true,
                  title,
                  description = "Submit",
                  error,
                  errorMessage,
                  width,
                  background,
                  color,
                  onMouseDown,
                  onMouseUp,
                  className
                }) {
  return (
    <>
      <div className={classes.background}>
        <input className={classNames(classes.submit, className)}
               disabled={!enable}
               style={{
                 width: width,
                 background: background,
                 color: color
               }}
               type="submit"
               title={title}
               value={description}
               onMouseDown={onMouseDown && (() => onMouseDown(id))}
               onMouseUp={onMouseUp && (() => onMouseUp(id))}
               onClick={preventDefault && ((event) => event.preventDefault())}
        />
      </div>
      <motion.p className={classes.error}
                initial={false}
                animate={{ height: error ? "auto" : 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.8, 0, 0.5, 1]
                }}>
        {errorMessage.map(message => (
          <Fragment key={message}>
            {message}
            <br />
          </Fragment>
        ))}
      </motion.p>
    </>
  )
}

export default SubmitOld;