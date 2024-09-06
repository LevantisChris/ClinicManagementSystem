import React, {useContext, useEffect, useState} from 'react'
import dayjs from "dayjs";
import GlobalContext from "../../../context/GlobalContext";

export default function Day({appointmentsOfTheDay, day, rowIdx}) {

    const [dayEvents, setDayEvents] = useState([]);
    const {setDaySelected, setShowEventModal, setShowInsertModal, filteredEvents, setSelectedEvent, viewEnglish} = useContext(GlobalContext);

    /* Take all the events that correspond to that day */
    useEffect(() => {
        const events = filteredEvents.filter(e => dayjs(e.day).format("DD-MM-YY")
                === day.format("DD-MM-YY"));
        setDayEvents(events);
    }, [filteredEvents, day]);

    function getCurrentDayClass() {
        return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY') ?
            'bg-blue-600 text-white rounded-full w-7' : ''
    }

    function dayToGreek(s) {
        if(s === "SUN") {
            return "ΚΥΡ"
        } else if(s === "MON") {
            return "ΔΕΥ"
        } else if(s === "TUE") {
            return "ΤΡΙ"
        } else if(s === "WED") {
            return "ΤΕΤ"
        } else if(s === "THU") {
            return "ΠΕΜ"
        } else if(s === "FRI") {
            return "ΠΑΡ"
        } else if(s === "SAT") {
            return "ΚΥΡ"
        }
    }

    return (
        <div className={`border border-gray-200 flex flex-col`}>
            <header className={'flex flex-col items-center'}>
                {rowIdx === 0 && (
                    <p className={'text-sm mt-1'}>{viewEnglish ? day.format('ddd').toUpperCase() : dayToGreek(day.format('ddd').toUpperCase())}</p>
                )}
                <p
                    className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()} rounded-full hover:bg-sky-200 cursor-pointer transition duration-500 ease-in-outs`}
                    onClick={() => {
                        setDaySelected(day);
                        setShowInsertModal(true);
                    }}>
                    {day.format('DD')}
                </p>
            </header>
            <div
                className="flex-1 cursor-pointer"
                onClick={() => {
                    setDaySelected(day);
                    setShowEventModal(true);
                }}
            >
                {
                    appointmentsOfTheDay ? (
                        <>
                            {appointmentsOfTheDay
                                .filter(appointment => appointment.appointmentDate === day.format('YYYY-MM-DD'))
                                .filter(appointment => appointment.appointmentStateId !== 4)
                                .slice(0, 3) // Limit to the first 3 elements
                                .map(appointment => (
                                    <div
                                        onClick={() => {
                                            // Your click handler here
                                        }}
                                        className={`bg-blue-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
                                        key={appointment.appointmentId} // Ensure each item has a unique key
                                    >
                                        {appointment.appointmentJustification}
                                    </div>
                                ))
                            }
                            {appointmentsOfTheDay
                                .filter(appointment => appointment.appointmentDate === day.format('YYYY-MM-DD'))
                                .length > 3 && (
                                <span
                                    className="material-icons-outlined text-gray-400 mr-1"
                                    style={{ verticalAlign: "middle" }}
                                >
                                    more_horiz
                                </span>
                            )}
                        </>
                    ) : null
                }
            </div>
        </div>
    );
}