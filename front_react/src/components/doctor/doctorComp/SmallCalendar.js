import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { getMonth } from "../util";
import GlobalContext from "../../../context/GlobalContext";

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  /* It will have to be synced with the big calendar,
   *  so it need to have a local state */
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const { monthIndex, setSmallCalendarMonth, setDaySelected, daySelected,viewEnglish} =
    useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1);
  }

  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1);
  }

  function getDayClass(day) {
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const curDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === curDay) {
      return "bg-blue-500 rounded-full text-white";
    } else if (curDay === slcDay) {
      return "bg-blue-100 rounded-full text-blue-600 font-bold";
    } else {
      return "";
    }
  }

  /* The date object starts from 0 */
  function getGreekDate(formattedDate, year) {
    if(formattedDate === "September") {
      return "Σεπτέμβριος " + year;
    } else if(formattedDate === "October") {
      return "Οκτώβριος " + year;
    } else if(formattedDate === "November") {
      return "Νοεμβριος " + year
    } else if(formattedDate === "December") {
      return "Δεκέμβριος " + year
    } else if(formattedDate === "January") {
      return "Ιανουάριος " + year
    } else if(formattedDate === "February") {
      return "Φεβρουάριος " + year
    } else if(formattedDate === "March") {
      return "Μαρτιος " + year
    } else if(formattedDate === "April") {
      return "Απρίλιος " + year
    } else if(formattedDate === "May") {
      return "Μάιος " + year
    } else if(formattedDate === "June") {
      return "Ιούνιος " + year
    } else if(formattedDate === "July") {
      return "Ιούλιος " + year
    } else if(formattedDate === "August") {
      return "Άυγουστος " + year
    }

    // Implement Greek date formatting logic here
    return "Greek Date"; // Replace this with the actual Greek date format
  }

  return (
    <div
      className={
        "bg-white mt-9 mb-5 hover:bg-gray-100 p-2 rounded-xl transition duration-300 ease-in-out border-4"
      }
    >
      {" "}
      <header className={"flex justify-between"}>
        <p className={"text-gray-500 font-bold"}>
          {viewEnglish
              ? dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")
              : getGreekDate(dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM"), dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY"))
          }
        </p>
        <div>
          <button onClick={handlePrevMonth}>
            <span
              className={
                "material-icons-outlined cursor-pointer text-gray-600 mx-2"
              }
            >
              chevron_left
            </span>
          </button>
          <button onClick={handleNextMonth}>
            <span
              className={
                "material-icons-outlined cursor-pointer text-gray-600 mx-2"
              }
            >
              chevron_right
            </span>
          </button>
        </div>
      </header>
      <div className={"grid grid-cols-7 grid-row-6"}>
        {currentMonth[0].map((day, i) => (
          <span key={i} className={"text-xs py-1 text-center text-zinc-700"}>
            {day.format("dd").charAt(0)}
          </span>
        ))}
        {currentMonth.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSmallCalendarMonth(currentMonthIdx);
                  setDaySelected(day);
                }}
                className={`text-sm py-1 w-full ${getDayClass(day)}`}
              >
                <span className={"txt-sm"}>{day.format("D")}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
