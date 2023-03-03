import classes from "./Month.module.css"
import Button, { BUTTON } from "../Button";
import { differenceInCalendarDays } from "date-fns";
import useFormat from "../../../hooks/useFormat";

function Month({
                 monthBase,
                 monthOffset,
                 monthSpan,
                 rangeBase,
                 rangeSpan,
                 layer = 2, // menu component defaults to 2
                 onSelect
               }) {
  const { format, locale } = useFormat();

  const days = Array(monthSpan).fill().map((_, index) => (
    new Date(
      monthBase.getFullYear(),
      monthBase.getMonth(),
      monthBase.getDate() + index
    )
  ))

  return (
    <>
      <header className={classes.month_head} style={{ zIndex: layer }}>
        {format(monthBase, "MMMM")}
      </header>
      <div className={classes.month_caption} style={{ zIndex: layer }}>
        {[...Array(7)].map((_, index) => (
          <span key={"day_" + index}>
            {locale.localize.day(index, { width: "abbreviated" })}
          </span>
        ))}
      </div>
      <div className={classes.month_body} style={{ zIndex: layer }}>
        {/* empty tiles */ [...Array(monthOffset)].map((_, index) =>
          <Button type={BUTTON.TYPES.DISABLED} key={"empty_" + index} layer={layer + 1} />
        )}
        {/* days before today */ [...Array(monthBase.getDate() - 1)].map((_, index) =>
          <Button icon={index + 1}
                  type={BUTTON.TYPES.DISABLED}
                  key={"disabled_" + index}
                  layer={layer + 1} />
        )}
        {/* days after today */ days.map((day) => (
          <Button id={day.toISOString()}
                  icon={day.getDate()}
                  title={format(day, "do MMM Y")}
                  layer={layer + 1}
                  onClick={onSelect}
                  active={
                    0 <= differenceInCalendarDays(day, rangeBase) &&
                    differenceInCalendarDays(day, rangeBase) <= rangeSpan
                  }
                  type={BUTTON.TYPES.VALUE}
                  key={day.toDateString()} />
        ))}
      </div>
    </>
  )
}

export default Month;