import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { add, set } from "date-fns";
import { motion } from "framer-motion";

import Button, { BUTTON } from "../interfaces/Button";
import Field, { FIELD } from "../interfaces/Field";
import {
  BadgeIcon, CalendarIcon, CancelIcon, CheckboxIcon, CheckboxInsetIcon,
  DownChevronIcon, HashIcon, MinusIcon, PlusIcon, SearchIcon,
  TagIcon, UpChevronIcon, WheelchairIcon
} from "../icons";
import Calendar from "../interfaces/Calendar";
import Submit, { SUBMIT } from "../interfaces/Submit";

import classes from "./SearchBar.module.css";
import useFormat from "../../hooks/useFormat";
import { ALIGNMENT, EASE, COLORS, DURATION, LAYERS, LENGTHS, LISTENER } from "../../constants/css";
import Menu from "../interfaces/Menu";
import {
  DEFAULT_RATE, RATES,
  MAX_AGE, AGE_NONE_PLACEHOLDER, AGE_NONE, AGE_ZERO_PLACEHOLDER,
  DEFAULT_ROOM_CNT, DEFAULT_ADULTS_PER_ROOM,
  DEFAULT_CHILDREN_PER_ROOM, OFFER_RATE
} from "../../constants/hotel-attributes";
import Checkbox from "../interfaces/Checkbox";
import SearchContext from "../../contexts/search-context";

const WEEKDAY_FORMAT = "ccc";
const DATE_FORMAT = "dd MMM";
const LOWER_STATE = {
  IMMEDIATE: {
    delay: 0,
    overflow: { delay: 0 }
  },
  DELAYED: {
    delay: DURATION.SLOW,
    overflow: { delay: DURATION.SLOW }
  },
  EXPAND: {
    delay: 0,
    overflow: { delay: DURATION.SLOW }
  }
}
export const SEARCHBAR = {
  TYPES: {
    DEFAULT: {
      description: "find_hotels",
      state: LOWER_STATE.IMMEDIATE,
    },
    UPDATE: {
      description: "update",
      state: LOWER_STATE.IMMEDIATE,
    },
    PAYMENT: {
      description: "update",
      state: LOWER_STATE.EXPAND,
    }
  }
}
const ADD = 0, MINUS = 1;
const toggleHandler = (min, state, setState) => (type) => {
  switch (type) {
    case ADD:
      setState(state + 1);
      break;
    case MINUS:
      if (min < state) setState(state - 1);
      break;
  }
}
function ValueGroup({
                      min = 1,
                      state,
                      setState = (state) => console.log(state),
                      caption,
                    }) {
  return (
    <div className={classes.value_group}>
      <Button icon={<MinusIcon />} id={MINUS}
              onMouseUp={toggleHandler(min, state, setState)} />
      <Field caption={caption}
             defaultValue={state} onLeave={(e) => setState(+e.target.value)}
             type={FIELD.TYPES.NUMBER} align={FIELD.ALIGN.CENTER} />
      <Button icon={<PlusIcon />} id={ADD}
              onMouseUp={toggleHandler(min, state, setState)} />
    </div>
  )
}

const SearchBar = React.forwardRef(({
                                      type = SEARCHBAR.TYPES.DEFAULT
                                    }, ref) => {
  //// context
  const { query, setQuery } = useContext(SearchContext);

  //// translations
  const { t } = useTranslation();
  const { format } = useFormat();

  //// references
  const lowerRef = useRef(null);

  //// states
  const [searchText, setSearchText] = useState(query.text);
  const [searchDate, setSearchDate] = useState(query.date);
  const [searchRate, setSearchRate] = useState(query.rate);
  const [searchAge, setSearchAge] = useState(query.age);
  const [searchRooms, setSearchRooms] = useState(query.rooms);
  const [searchAdults, setSearchAdults] = useState(query.adults);
  const [searchChildren, setSearchChildren] = useState(query.children);
  const [searchOfferCode, setSearchOfferCode] = useState(query.offerCode);
  const [searchUsePoints, setSearchUsePoints] = useState(query.usePoints);
  const [searchAccessible, setSearchAccessible] = useState(query.accessible);

  const [lowerState, setLowerState] = useState(type.state);
  const [calenderExpand, setCalenderExpand] = useState(false);
  const [ratesExpand, setRatesExpand] = useState(false);
  const [ageExpand, setAgeExpand] = useState(false);

  const [cancelPosition, setCancelPosition] = useState(BUTTON.POSITION.DEFAULT);

  //// helper functions
  const formatDate = (date) => {
    return `${format(date, WEEKDAY_FORMAT)}\, ${format(date, DATE_FORMAT)}`
  }

  //// handlers
  const dateSelectHandler = (range) => setSearchDate(prevInput => {
    let start = set(prevInput.start, {
      year: range.base.getFullYear(),
      month: range.base.getMonth(),
      date: range.base.getDate(),
      hours: 12
    });
    return {
      start: start,
      end: add(start, { days: range.span }),
      span: range.span
    }
  })
  const rateSelectHandler = (rate) => setSearchRate(rate);
  const ageSelectHandler = (age) => setSearchAge(age);
  function calendarMenuHandler() {
    expandLowerHandler();
    setCalenderExpand(!calenderExpand)
  }
  const ratesMenuHandler = () => setRatesExpand(!ratesExpand)
  const ageMenuHandler = () => setAgeExpand(!ageExpand)
  const expandLowerHandler = () => setLowerState(LOWER_STATE.EXPAND)
  function collapseLowerHandler() {
    (ratesExpand || ageExpand)
      ? setLowerState(LOWER_STATE.DELAYED)
      : setLowerState(LOWER_STATE.IMMEDIATE)
    setCalenderExpand(false);
    setRatesExpand(false);
    setAgeExpand(false);
  }
  function submitHandler() {
    if (lowerState === LOWER_STATE.EXPAND) {
      setQuery({
        text: searchText,
        date: searchDate,
        rate: searchRate,
        age: searchAge,
        rooms: searchRooms,
        adults: searchAdults,
        children: searchChildren,
        offerCode: searchOfferCode,
        usePoints: searchUsePoints,
        accessible: searchAccessible
      })
      collapseLowerHandler();
    } else expandLowerHandler();
  }
  const resizeHandler = () => setCancelPosition(
    window.innerWidth < LENGTHS.PARTITION_M + 2 * LENGTHS.UNIT_LENGTH
      ? BUTTON.POSITION.DEFAULT
      : BUTTON.POSITION.RIGHT
  );

  //// effects
  useEffect(() => {
    resizeHandler();
    window.addEventListener(LISTENER.RESIZE, resizeHandler);
    return () => {
      window.removeEventListener(LISTENER.RESIZE, resizeHandler);
    }
  }, [])
  useEffect(() => {
    setLowerState(type.state);
  }, [type])

  return (
    <div className={classes.search} style={{ zIndex: LAYERS.SEARCHBAR }} ref={ref}>
      <form className={classes.search_wrapper} style={{ zIndex: LAYERS.SEARCHBAR }}>
        <fieldset className={classes.upper_section} style={{ zIndex: LAYERS.SEARCHBAR + 1 }}>
          <Field icon={<SearchIcon />}
                 onSelect={expandLowerHandler}
                 name="searchInput"
                 width="100%"
                 onLeave={(e) => setSearchText(e.target.value)}
                 placeholder={t("search_placeholder")} />
          <Calendar defaultDate={searchDate.start}
                    onDateSelect={dateSelectHandler}
                    maxDisplayMonths={3}
                    includeToday={true}
                    defaultRangeSpan={1}
                    enableRangeSelection={true}
                    layer={LAYERS.SEARCHBAR}
                    expand={calenderExpand}
                    activator={
                      <div className={classes.calendar_wrapper}>
                        <Button onMouseUp={calendarMenuHandler}
                                iconDescription={formatDate(searchDate.start)}
                                select={calenderExpand}
                                width={"150px"}
                                alignment={ALIGNMENT.CENTER}
                                content={BUTTON.CONTENT.TEXT} />
                        <Button onMouseUp={calendarMenuHandler}
                                type={BUTTON.TYPES.MENU}
                                active={calenderExpand}
                                icon={<CalendarIcon />} />
                        <Button onMouseUp={calendarMenuHandler}
                                iconDescription={formatDate(searchDate.end)}
                                select={calenderExpand}
                                width={"150px"}
                                alignment={ALIGNMENT.CENTER}
                                content={BUTTON.CONTENT.TEXT} />
                      </div>
                    } />
          <Submit description={t(type.description)}
                  title={t(type.description)}
                  layer={LAYERS.SEARCHBAR}
                  state={(
                    lowerState === LOWER_STATE.EXPAND ||
                    type === SEARCHBAR.TYPES.DEFAULT
                  ) ? SUBMIT.STATES.IDLE
                    : SUBMIT.STATES.CLICK}
                  width={`${3 * LENGTHS.UNIT_LENGTH}px`}
                  onMouseUp={submitHandler} />
          <Button icon={<CancelIcon />}
                  layer={LAYERS.SEARCHBAR}
                  position={cancelPosition}
                  onMouseUp={collapseLowerHandler}
                  expand={lowerState === LOWER_STATE.EXPAND} />
        </fieldset>
        <motion.div className={classes.lower_section} ref={lowerRef}
                    style={{ zIndex: LAYERS.SEARCHBAR }}
                    initial={false}
                    animate={lowerState === LOWER_STATE.EXPAND
                      ? { height: "max-content", overflow: "visible" }
                      : { height: 0, overflow: "hidden" }}
                    transition={{
                      duration: DURATION.SLOW, ease: EASE.NORMAL,
                      ...lowerState,
                    }}>
          <fieldset className={classes.value_fields}>
            <ValueGroup caption={t("rooms", { count: searchRooms })}
                        state={searchRooms} setState={setSearchRooms} />
            <ValueGroup caption={t("adults_per_room", { count: searchAdults })}
                        state={searchAdults} setState={setSearchAdults} />
            <ValueGroup caption={t("children_per_room", { count: searchChildren })} min={0}
                        state={searchChildren} setState={setSearchChildren} />
            <Menu expand={ageExpand}
                  style={{ marginLeft: LENGTHS.UNIT_LENGTH }}
                  activator={
                    <div className={classes.value_group}>
                      <Field caption={t("youngest_age")}
                             state={searchChildren ? FIELD.STATES.DISPLAY : FIELD.STATES.DISABLED}
                             width={LENGTHS.UNIT_LENGTH} align={FIELD.ALIGN.CENTER}
                             displayValue={(searchAge === AGE_NONE)
                               ? AGE_NONE_PLACEHOLDER
                               : (searchAge || AGE_ZERO_PLACEHOLDER)} />
                      <Button icon={<DownChevronIcon />} underlay={<UpChevronIcon />}
                              type={searchChildren ? BUTTON.TYPES.MENU : BUTTON.TYPES.DISABLED}
                              active={ageExpand}
                              onMouseUp={ageMenuHandler} />
                    </div>
                  }>
              <div className={classes.age_menu}>
                <Button type={BUTTON.TYPES.VALUE}
                        id={AGE_NONE}
                        active={searchAge === AGE_NONE}
                        onMouseUp={ageSelectHandler}
                        icon={AGE_NONE_PLACEHOLDER} />
                {Array(MAX_AGE + 1).fill().map((_, index) => (
                  <Button type={BUTTON.TYPES.VALUE}
                          key={index}
                          id={index}
                          active={searchAge === index}
                          onMouseUp={ageSelectHandler}
                          icon={index || AGE_ZERO_PLACEHOLDER} />
                ))}
              </div>
            </Menu>
          </fieldset>
          <fieldset className={classes.rates_fields}>
            <Menu expand={lowerState && ratesExpand}
                  finalWidth="100%"
                  activator={
                    <div className={classes.rates_group}>
                      <Button icon={<TagIcon />}
                              iconDescription={t("special_rates")}
                              onMouseUp={ratesMenuHandler}
                              content={BUTTON.CONTENT.ADJACENT} />
                      <Button icon={<DownChevronIcon />}
                              active={ratesExpand}
                              underlay={<UpChevronIcon />}
                              onMouseUp={ratesMenuHandler}
                              type={BUTTON.TYPES.MENU} />
                    </div>
                  }>
              {RATES.map((rate, index) => (
                <Button type={BUTTON.TYPES.OPTION}
                        content={BUTTON.CONTENT.TEXT}
                        width="100%"
                        id={rate}
                        key={index}
                        active={searchRate.value === rate.value}
                        onMouseUp={rateSelectHandler}
                        iconDescription={t(rate.name)} />
              ))}
            </Menu>
            <Field icon={<HashIcon />}
                   state={searchRate === OFFER_RATE
                     ? FIELD.STATES.IDLE
                     : FIELD.STATES.DISABLED}
                   onLeave={(e) => setSearchOfferCode(e.target.value)}
                   placeholder={t("offer_code")} />
          </fieldset>
          <fieldset className={classes.options_fields}>
            <Checkbox state={searchAccessible} setState={setSearchAccessible}>
              <WheelchairIcon />
              <span style={{ marginLeft: LENGTHS.GAP_ICON }}>
                {t("accessible_room")}
              </span>
            </Checkbox>
            <Checkbox state={searchUsePoints} setState={setSearchUsePoints}>
              <BadgeIcon />
              <span style={{ marginLeft: LENGTHS.GAP_ICON }}>
                  {t("use_points")}
              </span>
            </Checkbox>
          </fieldset>
        </motion.div>
      </form>
    </div>
  );
});

export default SearchBar;