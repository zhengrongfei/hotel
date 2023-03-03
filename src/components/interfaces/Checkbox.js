import Button, { BUTTON } from "./Button";
import { CheckboxIcon, CheckboxInsetIcon } from "../icons";

// An alias of Button to reduce boilerplate.
function Checkbox({
                    children,
                    handler,
                    setState,
                    state,
                  }) {
  return (
    <Button icon={<CheckboxIcon />}
            underlay={<CheckboxInsetIcon />}
            description={children}
            active={state}
            onClick={setState
              ? () => setState((prevState) => !prevState)
              : handler}
            type={BUTTON.TYPES.SELECTION} />
  )
}

export default Checkbox;