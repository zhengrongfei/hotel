import React, { createRef, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  differenceInCalendarDays, getDaysInMonth, isBefore, startOfMonth, startOfWeek
} from "date-fns";
import { motion } from "framer-motion";
import { Element, scroller } from "react-scroll";

import LanguageContext from "../../../contexts/language-context";
import classes from "./index.module.css";
import { LeftChevronIcon, RightChevronIcon } from "../../icons";
import Button, { BUTTON } from ".././Button";
import Month from "./Month";
import Loader from "../Loader";
import ScrollBox from "../ScrollBox";
import Menu from "../Menu";

import { DIRECTION, LENGTHS, LISTENER } from "../../../constants/css";
import { THRESHOLD } from "../../../constants/threshold";
import { ID, NAME } from "../../../constants/identifiers";
import { scrollToElement } from "../../functions";

function alterMonth(date, value) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + value,
  )
}

// TODO vertical mobile display
function Calendar({
                    currentDate = new Date(),       // today's date, used to set month offsets
                    activator,                            // the button (or group of buttons) to activate the calendar
                    defaultDate,                          // the default selected date can be different from today
                    includeToday = false,         // whether user can select the current day
                    enableRangeSelection = true,  // whether user selects a date range or a single day
                    defaultRangeSpan = 0,         // the number of days pre-selected, default to 1 day total
                    maxDisplayMonths = 2,         // maximum numbers of months to be visible (caps auto-adjust)
                    defaultLoadMonths = 6,        // number of months loaded by default
                    loadMonthSpan = 6,            // number of new months to be loaded
                    vertical = false,             // whether calendar is to display vertically
                    centered = true,              // whether calendar is centered in regard to menu button
                    expand = false,               // whether to expand the calendar
                    layer = 2,                    // menu component defaults to 2
                    onDateSelect                          // callback function when a date is selected
                  }) {
  //// translation
  const userLanguageContext = useContext(LanguageContext);
  const { t } = useTranslation();

  //// references
  const activatorRef = useRef(null);

  //// helper functions
  function getMonthOffset(date) {
    return differenceInCalendarDays(
      date,
      startOfWeek(date, { locale: userLanguageContext.currentLocale })
    )
  }
  function getMonthSettings(startDate, span, offset = 0) {
    return Array(span).fill().map((_, index) => {
      const tempDate = alterMonth(startDate, index + 1 + offset);
      return {
        base: tempDate,
        offset: getMonthOffset(tempDate),
        span: getDaysInMonth(tempDate),
        ref: createRef()
      }
    })
  }

  //// states
  const [range, setRange] = useState({
    anchor: defaultRangeSpan === 0,
    base: defaultDate || currentDate,
    span: defaultRangeSpan
  });
  const [monthSettings, setMonthSettings] = useState([
    {
      base: currentDate,
      offset: getMonthOffset(startOfMonth(currentDate)),
      span: getDaysInMonth(currentDate) - currentDate.getDate() + 1
    }, ...getMonthSettings(currentDate, defaultLoadMonths - 1)
  ]);
  const [viewportShifts, setViewportShifts] = useState(0);
  // number of months to be displayed horizontally, set to 0 when vertical display needed
  const [horizontalMonths, setHorizontalMonths] = useState(vertical ? 0 : 1);

  //// handlers
  function selectHandler(date) {
    let inputDate = new Date(date);
    if (enableRangeSelection)
      setRange(prevRange => {
        return {
          anchor: !prevRange.anchor,
          base: !prevRange.anchor || isBefore(inputDate, prevRange.base)
            ? inputDate
            : prevRange.base,
          span: prevRange.anchor ? Math.abs(differenceInCalendarDays(prevRange.base, inputDate)) : 0
        };
      })
    else
      setRange({ anchor: true, base: inputDate, span: 0 });
  }
  function preloadHandler() {
    if (
      monthSettings.length === viewportShifts + horizontalMonths &&
      monthSettings.length !== THRESHOLD.MONTH_RENDER_LIMIT
    ) {
      setMonthSettings(prevMonthSettings => {
        return prevMonthSettings.concat(
          getMonthSettings(
            currentDate,
            Math.min(loadMonthSpan, THRESHOLD.MONTH_RENDER_LIMIT - monthSettings.length),
            prevMonthSettings.length - 1
          ))
      })
    }
  }
  function previousHandler() {
    if (viewportShifts)
      scrollToElement(
        NAME.MONTHS + (viewportShifts - 1).toString(),
        ID.MONTH_VIEWPORT,
        vertical
      );
  }
  function nextHandler() {
    if (viewportShifts < THRESHOLD.MONTH_RENDER_LIMIT)
      scrollToElement(
        NAME.MONTHS + (viewportShifts + 1).toString(),
        ID.MONTH_VIEWPORT,
        vertical
      );
  }
  function scrollHandler(e) {
    setViewportShifts(
      Math.max(0,
        Math.floor(e.target.scrollLeft / (8 * LENGTHS.UNIT_LENGTH)))
    );
  }
  function resizeHandler() {
    const activatorLeft = activatorRef.current.getBoundingClientRect().left -
      (window.innerWidth < (LENGTHS.PARTITION_M + 2 * LENGTHS.UNIT_LENGTH)
          ? LENGTHS.UNIT_LENGTH
          : 0
      )
    const maxDisplayableMonths = Math.max(Math.floor(((centered
        // calculate the entire width if centered
        ? (window.innerWidth - activatorLeft - (
            activatorRef.current.getBoundingClientRect().width / 2
          )) / LENGTHS.UNIT_LENGTH * 2 - 7
        // calculate only half of the total width add half of the month container
        : ((window.innerWidth - activatorLeft) / LENGTHS.UNIT_LENGTH / 2) - 3.5
    ) / 8)), 0) + 1
    setHorizontalMonths(Math.min(maxDisplayableMonths, maxDisplayMonths));
  }

  //// effects
  useEffect(() => onDateSelect(range), [range]);
  useEffect(() => {
    /* START[date adjustment] */
    currentDate.setHours(0, 0, 0, 0) // set to 0 to ensure that each day starts at the same time
    currentDate.setDate(currentDate.getDate() + (!includeToday)) // whether to include today into selection
    /* END[date adjustment] */

    /* START[resize listener] */
    if (!vertical) {
      const monthViewport = document.getElementById(ID.MONTH_VIEWPORT);

      resizeHandler();

      window.addEventListener(LISTENER.RESIZE, resizeHandler);
      monthViewport.addEventListener(LISTENER.SCROLL, scrollHandler);
      return () => {
        window.removeEventListener(LISTENER.RESIZE, resizeHandler);
        monthViewport.removeEventListener(LISTENER.SCROLL, scrollHandler);
      }
    }
    /* END[resize listener] */
  }, [])

  return (
    <Menu expand={expand}
          layer={layer}
          finalWidth={(horizontalMonths * 8 - 1) * LENGTHS.UNIT_LENGTH}
          ref={activatorRef}
          activator={activator}
          centered={centered}>
      <span className={classes.month_header} />
      <ScrollBox style={{ zIndex: layer }}
                 id={ID.MONTH_VIEWPORT}
                 viewportClassName={classes.month_viewport}
                 length={(horizontalMonths * 8 - 1) * LENGTHS.UNIT_LENGTH}
                 enableInteract={false}
                 vertical={false}>
        {monthSettings.map((settings, index) => (
          <Element className={classes.month}
                   ref={settings.ref}
                   name={NAME.MONTHS + index.toString()}
                   key={settings.base.toDateString()}>
            <Month monthBase={settings.base}
                   monthSpan={settings.span}
                   monthOffset={settings.offset}
                   rangeBase={range.base}
                   rangeSpan={range.span}
                   onSelect={selectHandler}
                   layer={layer}
                   style={
                     userLanguageContext.currentLanguage.DIRECTION === DIRECTION.RTL
                     && { onScrollSnap: "end" }
                   } />
          </Element>
        ))}
        {/*TODO loading puller*/}
        {/*<Loader threshold={80} />*/}
      </ScrollBox>
      <motion.div className={classes.button_container}
                  style={{ zIndex: layer + 4 }}
                  initial={false}
                  animate={{ opacity: expand ? 1 : 0 }}
                  transition={{
                    delay: expand ? 0.2 : 0,
                    duration: 0.3,
                    ease: "linear"
                  }}>
        <Button icon={<LeftChevronIcon />}
                className={classes.button}
                type={(viewportShifts && expand)
                  ? BUTTON.TYPES.CLICK : BUTTON.TYPES.DISABLED}
                onClick={previousHandler}
                title={t("previous_month")}
                layer={layer + 4} />
        <Button icon={<RightChevronIcon />}
                className={classes.button}
                type={(viewportShifts !== THRESHOLD.MONTH_RENDER_LIMIT - horizontalMonths && expand)
                  ? BUTTON.TYPES.CLICK : BUTTON.TYPES.DISABLED}
                onMouseUp={nextHandler}
                onMouseDown={preloadHandler}
                title={t("next_month")}
                layer={layer + 4} />
      </motion.div>
    </Menu>
  )
}

export default Calendar;