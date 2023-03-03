{/*<header className="App-header">*/}
{/*    <img src={logo} className="App-logo" alt="logo"/>*/}
{/*    <p>*/}
{/*        Edit <code>src/App.js</code> and save to reload.*/}
{/*    </p>*/}
{/*    <a*/}
{/*        className="App-link"*/}
{/*        href="https://reactjs.org"*/}
{/*        target="_blank"*/}
{/*        rel="noopener noreferrer"*/}
{/*    >*/}
{/*        Learn React*/}
{/*    </a>*/}
{/*</header>*/}

// <div className="App">
//   <header className="App-header">
//     {/*<img src={logo} className="App-logo" alt="logo"/>*/}
//     <p>
//       Edit <code>src/App.js</code> and save to reload.
//     </p>
//     <a
//       className="App-link"
//       href="https://reactjs.org"
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       Learn React
//     </a>
//   </header>
// </div>

// const [today, setToday] = useState(new Date());
//
// useEffect(() => {
//   selectHandler(date);
// }, []);
//
// const selectHandler = (date) => {
//   isDate(date) && setUserSelectedDate(date);
// };
//
// const renderMonthYear = () => {
//   const monthLabel = format(
//     userSelectedDate.getMonth(),
//     MONTH_FORMAT,
//     { locale: userLanguageContext.currentLocale }
//   )
//   return (
//     <div className={classes.calendar_header}>
//       <Button icon={<LeftChevronIcon />}
//               onClick={previousMonthHandler}
//               title={t("previous_month")}
//       />
//       <div className={classes.calendar_month}>
//         {monthLabel}{userSelectedDate.getFullYear()}
//       </div>
//       <Button icon={<RightChevronIcon />}
//               onClick={nextMonthHandler}
//               title={t("next_month")}
//       />
//     </div>
//   );
// };
//
// const renderDay = (day, index) => {
//   return (
//     <span className={classes.calendar_day} key={index}>
//       {format(
//         startOfWeek(day, { locale: userLanguageContext.currentLocale }) + index,
//         DAY_FORMAT,
//         { locale: userLanguageContext.currentLocale }
//       )}
//     </span>
//   );
// };
//
// return (
//   <Styled.CalendarContainer>
//     {renderMonthYear()}
//     <Styled.CalendarGrid>
//       {Object.keys(WEEK_DAYS).map(renderDay)}
//       {getCalendarDates(userSelectedDate).map(date => renderCalendar(date, userSelectedDate))}
//     </Styled.CalendarGrid>
//   </Styled.CalendarContainer>
// );

// const getCalendarDates = (date) => {
//   const daysFromCurrMonth = getDaysInMonth(date);
//   // number of days to be "borrowed" from the previous and next months
//   const daysFromPrevMonth = startOfMonth(date).getDay(); // starts from 0, equals day - 1
//   const daysFromNextMonth = (DISPLAYING_WEEKS * 7) - (daysFromPrevMonth + daysFromCurrMonth);
//
//   // get the number of days in previous month
//   const prevMonthDays = getDaysInMonth(new Date(
//     date.getFullYear(),
//     date.getMonth() // starts from 0, equals month - 1
//   ));
//
//   return [
//     // days from previous month
//     ...[...new Array(daysFromPrevMonth)].map((n, day_index) => {
//       return new Date(
//         date.getFullYear(),
//         date.getMonth(), // starts from 0, equals month - 1
//         day_index + 1 + (prevMonthDays - daysFromPrevMonth)
//       );
//     }),
//     // days from current month
//     ...[...new Array(daysFromCurrMonth)].map((n, day_index) => {
//       return new Date(
//         date.getFullYear(),
//         date.getMonth() + 1, // starts from 0, equals month
//         day_index + 1
//       );
//     }),
//     // days from next month
//     ...[...new Array(daysFromNextMonth)].map((n, day_index) => {
//       return new Date(
//         date.getFullYear(),
//         date.getMonth() + 2, // starts from 0, equals month + 1
//         day_index + 1
//       );
//     })
//   ]
// };
//
// const renderCalendar = (date, anchorDate, selectedDate) => {
//   // Check if calendar date is same day as currently selected date
//
//   // Check if calendar date is in the same month as the state month and year
//   const inMonth = isSameMonth(date, anchorDate);
//
//   const onClick = this.gotoDate(calendarDay);
//   const props = { index, inMonth, onClick, title: calendarDay.toDateString() };
//
//   const DateComponent = isSameDay(date, selectedDate)
//     ? Styled.HighlightedCalendarDate
//     : isSameDay(calendarDay, today)
//       ? Styled.TodayCalendarDate
//       : Styled.CalendarDate;
//   return (
//     <DateComponent key={getDateISO(calendarDay)} {...props}>
//       {calendarDay.getDate()}
//     </DateComponent>
//   );
// };
//
// const getMonthSpan = (date) => {
//   return date.getMonth() === 1
//     ? date.getFullYear() % 4 === 0 // leap year
//       ? 29
//       : 28
//     : [3, 5, 8, 10].includes(date.getMonth()) // months with 30 days
//       ? 30
//       : 31;
// }

// const initialTasks = [
//   { name: "Task 1", color: "red" },
//   { name: "Task 2", color: "green" },
//   { name: "Task 3", color: "yellow" },
//   { name: "Task 4", color: "gray" }
// ];

// const [tasks, setTasks] = useState(initialTasks);
// const refsArray = useRef([]);

// return (
//   <div>
//     <div>
//       <button onClick={() => {
//         const newTasks = tasks.concat([{
//           name: "Task " + this.state.tasks.length + 1,
//           color: randomColor()
//         }]);
//         setTasks(newTasks);
//       }}>Add new Task
//       </button>
//     </div>
//     {tasks.map((task, i) => (
//       <button
//         key={i}
//         onClick={() => {
//           refsArray.current[i].scrollIntoView();
//         }}>
//         Go to {task.name}
//       </button>
//     ))}
//     {tasks.map((task, i) => (
//       <div
//         key={i}
//         ref={ref => {
//           refsArray.current[i] = ref;
//         }}
//         style={{ height: "100px", backgroundColor: task.color }}>
//         {task.name}
//       </div>
//     ))}
//   </div>
// );