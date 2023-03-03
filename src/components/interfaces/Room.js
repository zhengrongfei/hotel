import classes from "./Room.module.css";
import { getDaysInMonth } from "date-fns";
import { createRef } from "react";
import { COLORS } from "../../constants/css";

function Room({
                room,
                active,
                onMouseUp
              }) {
  let clipPathProps = "polygon(";
  let center = { x: 0, y: 0 };
  room.coordinates.forEach(([x, y]) => {
    clipPathProps += `${x}% ${y}%,`;
    center.x += x;
    center.y += y;
  })
  center.x /= room.coordinates.length;
  center.y /= room.coordinates.length;
  return (
    <button className={classes.container}
            active={active.toString()}
            onMouseUp={() => onMouseUp(room)}>
      <span className={classes.room}
            style={{ clipPath: clipPathProps.replace(/,$/, "") + ")" }} />
      <span className={classes.name}
            style={{ left: `${center.x}%`, top: `${center.y}%` }}>
        {room.name}
      </span>
    </button>
  );
}

export default Room;