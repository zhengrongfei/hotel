import { useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import classes from "./CourseForm.module.css"

import {
  CalendarIcon, CancelIcon,
  DurationIcon,
  HashIcon,
  LocationIcon,
  PersonalInfoIcon,
  QuoteIcon, RadioIcon, RadioInsetIcon,
  TimeIcon
} from "../icons";
import Calendar from "./Calendar";
import Button, { BUTTON } from "./Button";
import Submit from "./Submit";
import Field, { FIELD } from "./Field";
import { LENGTHS } from "../../constants/css";
import IconHolder from "./IconHolder";
import InputRadio from "./InputRadio";
import { format, set } from "date-fns";

/*
  <CourseForm>

  Properties accepted:

 */

function defaultValidator(input) {
  return true;
}

const defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate() + 1);
defaultDate.setHours(8, 0, 0);

const defaultCourseInitialized = {
  courseName: "",
  id: "",
  teacher: "",
  language: "",
  location: "",
  duration: "",
  date: defaultDate
}

const languageSelection = ["Chinese", "English", "Bilingual"]

function CourseForm({
                      validator = defaultValidator,
                      cancelCallback,
                      defaultCourse = defaultCourseInitialized,
                      title = "Title",
                      buttonName,
                    }) {
  function submitHandler() {
    const validated = validator({
      courseName: courseName,
      id: courseCode,
      language: language,
      teacher: teacher,
      date: date,
      location: location,
      durationString: duration
    }, defaultCourse.id)

    if (validated[0]) {
      setError(true);
      setErrorMessage(validated[1]);
    } else {
      cancelCallback();
    }
  }

  const [calenderExpand, setCalenderExpand] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  const [date, setDate] = useState(defaultCourse.date);
  const [duration, setDuration] = useState(defaultCourse.duration + "");
  const [courseCode, setCourseCode] = useState(defaultCourse.id);
  const [courseName, setCourseName] = useState(defaultCourse.courseName);
  const [teacher, setTeacher] = useState(defaultCourse.teacher);
  const [language, setLanguage] = useState(defaultCourse.language);
  const [location, setLocation] = useState(defaultCourse.location);

  return (
    <div className={classes.form_container}>
      <button className={classes.parallelogram}></button>
      <div className={classes.title_bar}>
        <Button className={classes.cancel} icon={<CancelIcon />}
                onClick={cancelCallback} />
        <header className={classes.title}>
          {title}
        </header>
      </div>
      <motion.form className={classes.form}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{
                     duration: 0.4,
                     ease: "linear"
                   }}>
        {/*<textarea placeholder={"textarea"} />*/}
        <fieldset>
          <Field icon={<QuoteIcon />}
                 name="courseName"
                 placeholder="Course Name"
                 defaultValue={courseName}
                 onChange={(event) => setCourseName(event.target.value)} />
          <Field icon={<HashIcon />}
                 name="courseCode"
                 placeholder="Course Code"
                 defaultValue={courseCode}
                 topDivider={true}
                 onChange={(event) => setCourseCode(event.target.value)} />
          <Field icon={<PersonalInfoIcon />}
                 placeholder="Teacher"
                 defaultValue={teacher}
                 topDivider={true}
                 onChange={(event) => setTeacher(event.target.value)} />
        </fieldset>
        <fieldset>
          <Field icon={<DurationIcon />}
                 type={FIELD.TYPES.NUMBER}
                 defaultValue={duration}
                 placeholder="Duration (hours)"
                 onChange={(event) => setDuration(event.target.value)}
          />
          <Field icon={<TimeIcon />}
                 type={FIELD.TYPES.TIME}
                 defaultValue={format(date, "HH:mm")}
                 topDivider={true}
                 onChange={(event) => setDate(prevDate => {
                        const time = event.target.value.split(":");
                        return set(prevDate, { hours: time[0], minutes: time[1] })
                      })}
          />
          <Button onClick={() => setCalenderExpand(!calenderExpand)}
                  type={BUTTON.SELECTION}
                  iconDescription="Selection"
                  active={calenderExpand}
                  underlay={<RadioInsetIcon />}
                  icon={<RadioIcon />} />
          <Calendar defaultDate={date}
                    activator={
                      <div className={classes.date_field}>
                        <Button onClick={() => setCalenderExpand(!calenderExpand)}
                                type={BUTTON.MENU}
                                active={calenderExpand}
                                icon={<CalendarIcon />} />
                        <Button onClick={() => setCalenderExpand(!calenderExpand)}
                                iconDescription={date.toDateString()}
                                select={calenderExpand}
                                width="fit-content" />
                      </div>
                    }
                    onDateSelect={(date) => setDate(prevDate => {
                      return set(prevDate, { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() })
                    })}
                    maxDisplayMonths={4}
                    parentWidth={`${LENGTHS.UNIT_LENGTH}px`}
                    includeToday={true}
                    enableRangeSelection={true}
                    expand={calenderExpand}
                    centered={false}
          />
        </fieldset>
        <fieldset>
          <InputRadio selection={languageSelection}
                      title="Language"
                      name="language"
                      defaultValue={language}
                      onChange={(event) => setLanguage(event.target.value)} />
        </fieldset>
        <fieldset>
          <Button type={BUTTON.INACTIVE}
                  iconDescription={<select defaultValue={location || "default"}
                                           onChange={(event) => setLocation(event.target.value)}>
                    <option disabled value="default">Select Location</option>
                    <option value="Building No.1 Lecture Hall">Building No.1 Lecture Hall</option>
                    <option value="Research Building Lecture Hall">Research Building Lecture Hall</option>
                    <option value="Library Conference Hall">Library Conference Hall</option>
                    <option value="Activity Room">Activity Room</option>
                  </select>}
                  icon={<LocationIcon />} />
          <div className={classes.location_container}>
            <IconHolder icon={<LocationIcon />} />
            <select defaultValue={location || "default"} onChange={(event) => setLocation(event.target.value)}>
              <option disabled value="default">Select Location</option>
              <option value="Building No.1 Lecture Hall">Building No.1 Lecture Hall</option>
              <option value="Research Building Lecture Hall">Research Building Lecture Hall</option>
              <option value="Library Conference Hall">Library Conference Hall</option>
              <option value="Activity Room">Activity Room</option>
            </select>
          </div>
        </fieldset>
        <Submit description={buttonName}
                error={error}
                errorMessage={errorMessage}
                onClick={submitHandler} />
      </motion.form>
    </div>
  )
}

export default CourseForm;