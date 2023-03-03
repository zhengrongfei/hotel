import { SmallCrossIcon, SmallTickIcon } from "../icons";
import classes from "./Amenity.module.css";

function Amenity({
                   title,
                   available,
                 }) {
  return (
    <div className={classes.entry}>
      {available ? <SmallTickIcon /> : <SmallCrossIcon />}
      <span className={classes.title}>{title}</span>
    </div>
  );
}

export default Amenity;