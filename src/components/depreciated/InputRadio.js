import classes from "./InputRadio.module.css"
import { motion } from "framer-motion";
import { FIELD_TYPE } from "../../constants/css";
import { useState } from "react";

function InputRadio({
                      id,
                      enable = true,
                      defaultValue,
                      width,
                      error = false,
                      errorMessage,
                      focus = false,
                      percentEnable = true,
                      percentValue,
                      onChange,
                      onLeave,
                      onMouseDown,
                      onMouseUp,
                      selection,
                      title,
                      name
                    }) {
  return (
    <div className={classes.radio_wrapper}>
      <header className={classes.title}>
        {title}
      </header>
      {
        selection.map((selection, index) => {
          return <label className={classes.radio_container}
                        htmlFor={selection}
                        onChange={onChange}
                        key={index}>
            <input className={classes.radio}
                   type="radio"
                   name={name}
                   id={selection}
                   value={selection}
                   defaultChecked={selection === defaultValue}
            />
            {selection}
          </label>
        })
      }
    </div>
  )
}

export default InputRadio;