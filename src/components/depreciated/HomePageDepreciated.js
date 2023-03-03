import { useTranslation } from "react-i18next";
import { createRef, Fragment, useEffect, useState } from "react";

import { TrashIcon, EditIcon, PlusIcon } from "../components/icons";
import Table from "../components/interfaces/Table";
import Button from "../components/interfaces/Button";
import Wrapper from "../components/interfaces/Wrapper";
import CourseForm from "../components/interfaces/CourseForm";
import classes from "../components/interfaces/Table.module.css";
import { REGEX } from "../constants/regex";
import { areIntervalsOverlapping, format, isSameDay, setHours } from "date-fns";

const courseForm = {
  field: [
    {
      id: "courseName",
      header: "Course Name",
      validator: input => {
        if (input === "") return this.errors.EMPTY;
        if (!REGEX.CHARS_SPACE.test(input)) return this.errors.WRONG;

        return "";
      },
      errors: {
        WRONG: "Course name must be in english",
        EMPTY: "Course name is required"
      }
    }, {
      id: "courseCode",
      header: "Course Code",
      validator: input => {
        if (input === "") return this.errors.EMPTY;
        if (!REGEX.CHARS_NUMS.test(input)) return this.errors.WRONG;

        return ""
      },
      errors: {
        WRONG: "Course code must be include characters and digits",
        EMPTY: "Course code is required"
      }
    }, {
      id: "language",
      header: "Language",
      selection: ["Chinese", "English", "Bilingual"],
      validator: input => {
        return input ? "" : this.errors.EMPTY;
      },
      errors: {
        EMPTY: "Course language is required"
      }
    }, {
      id: "teacher",
      header: "Teacher",
      validator: input => {
        if (input === "") return this.errors.EMPTY;
        if (!REGEX.CHARS_SPACE.test(input)) return this.errors.WRONG;

        return "";
      },
    }, {
      id: "date",
      header: "Date",
      date: 30,
    }, {
      id: "time",
      header: "Time",
      selection: []
    }, {
      id: "location",
      header: "Location",
      validator: null,
    }, {
      id: "duration",
      header: "Duration",
      validator: null,
    }
  ]
}

let openCourses = {
  headers: courseForm.field.map(field => field.header),
  data: [{
    courseName: "OOAD",
    id: "CS309",
    language: "English",
    teacher: "XXX",
    date: new Date("2022-10-30T19:00:00+08:00"),
    location: "Activity Room",
    duration: 3.0,
  }, {
    courseName: "How to Study CS",
    id: "CS666",
    language: "Bilingual",
    teacher: "XXX",
    date: new Date("2022-09-29T16:20:00+08:00"),
    location: "Research Building Lecture Hall",
    duration: 2.5,
  }],
  formatter: (key, value) => {
    switch (key) {
      case "date":
        return (
          <Fragment key="date-time">
            <td className={classes.row_data} key={"date"}>
              {value.toLocaleDateString("zh-Hans-CN")}
            </td>
            <td className={classes.row_data} key={"time"}>
              {value.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })}
            </td>
          </Fragment>
        )
      case "duration":
        return (
          <td className={classes.row_data} key={key}>
            {value + "h"}
          </td>
        )
      default:
        return (
          <td className={classes.row_data} key={key}>
            {value}
          </td>
        )
    }
  }
}

function HomePage() {
  const [userOpenCourses, setUserOpenCourses] = useState(openCourses);

  function tableEntryEditHandler(id) {
    setEditContent(userOpenCourses.data.find(el => el.id === id))
  }

  function tableEntryDeleteHandler(id) {
    setUserOpenCourses(prevOpenCourses => {
      return {
        headers: prevOpenCourses.headers,
        data: prevOpenCourses.data.filter(el => el.id !== id),
        formatter: prevOpenCourses.formatter
      }
    })
  }

  function courseValidator(input, id) {
    let error = [];

    if (!input.courseName || !input.id || !input.teacher || !input.language || !input.location || !input.durationString)
      error.push(
        "All fields are required"
      )

    if (error.length) return [true, error]

    if (!REGEX.CHARS_SPACE.test(input.courseName))
      error.push("Course name can only be English letters")

    if (!REGEX.CHARS_NUMS.test(input.id))
      error.push("Course code should consist of letters and numbers")

    if (!REGEX.CHARS_SPACE.test(input.teacher))
      error.push("Teacher's name can only be English letters")

    const durationValue = parseFloat(input.durationString);

    if (!REGEX.INT.test(input.durationString))
      error.push("Duration must be a number")
    else if (durationValue <= 0) error.push("Duration must be a positive number")

    delete input.durationString;
    input.duration = durationValue;

    const conflictTeacher = userOpenCourses.data.find((course => {
        return (course.teacher === input.teacher)
          && isSameDay(course.date, input.date)
      }
    ))
    if (conflictTeacher)
      error.push(
        `Each teacher can take no more than one lecture per day`
      )

    const conflictCourse = userOpenCourses.data.find((course => {
        return (course.id === input.id)
          && isSameDay(course.date, input.date)
      }
    ))
    if (conflictCourse)
      error.push(
        `${input.id} should only be scheduled at most once a day`
      )

    const conflictCode = userOpenCourses.data.find((course => {
        return (course.id === input.id)
          && (course.courseName !== course.courseName)
      }
    ))
    if (conflictCode)
      error.push(
        `Different courses should have different course codes`
      )

    const endDate = setHours(input.date, input.date.getHours() + input.duration);
    const conflictLocation = userOpenCourses.data.find((course => {
        const courseEndDate = setHours(course.date, course.date.getHours() + course.duration)

        return (course.id !== id)
          && (course.location === input.location)
          && areIntervalsOverlapping({
            start: course.date,
            end: courseEndDate
          },{
            start: input.date,
            end: endDate
          })
      }
    ))
    if (conflictLocation)
      error.push(
        `This course is sharing the same location with ${
          conflictLocation.courseName
        } at ${
          format(conflictLocation.date, "HH:mm do MMM Y")
        }`
      )

    if (error.length) return [true, error]
    else {
      if (editContent) {
        userOpenCourses.data.forEach((course, index) => {
          if (course.id === id) userOpenCourses.data[index] = input;
        });
        setEditContent(null);
      }

      if (showForm) {
        toggleShowForm(false)
        setUserOpenCourses(prevOpenCourses => {
          return {
            headers: prevOpenCourses.headers,
            data: prevOpenCourses.data.concat(input),
            formatter: prevOpenCourses.formatter
          }
        })
      }
      return [false,]
    }
  }

  const [showForm, toggleShowForm] = useState(false);
  const [editContent, setEditContent] = useState(null);

  return (
    <>
      {editContent && <CourseForm title={`Edit ${editContent.courseName}`}
                                  validator={courseValidator}
                                  defaultCourse={editContent}
                                  buttonName="Edit"
                                  cancelCallback={() => setEditContent(null)}
      />}
      {showForm && <CourseForm title="Add Course"
                               validator={courseValidator}
                               cancelCallback={() => toggleShowForm(false)}
      />}
      <Table
        title="Open Courses"
        content={userOpenCourses}
        entryActionGenerator={(id) => (
          <Wrapper vertical={false}>
            <Button icon={<EditIcon />}
                    title={`Edit ${id}`}
                    id={id}
                    onClick={tableEntryEditHandler} />
            <Button icon={<TrashIcon />}
                    title={`Delete ${id}`}
                    id={id}
                    onClick={tableEntryDeleteHandler} />
          </Wrapper>
        )}
        tableAction={
          <Button icon={<PlusIcon />}
                  iconDescription="Add Course"
                  width="100%"
                  alignment="center"
                  onClick={() => toggleShowForm(true)} />
        }
      />
    </>
  );
}

export default HomePage;