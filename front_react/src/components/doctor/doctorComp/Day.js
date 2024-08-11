import React, {useContext, useEffect, useState} from 'react'
import dayjs from "dayjs";
import GlobalContext from "../../../context/GlobalContext";

export default function Day({day, rowIdx}) {

    const [dayEvents, setDayEvents] = useState([]);
    const {setDaySelected, setShowEventModal, setShowInsertModal, filteredEvents, setSelectedEvent} = useContext(GlobalContext);

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

    return (
        <div className={`border border-gray-200 flex flex-col`}>
            <header className={'flex flex-col items-center'}>
                {rowIdx === 0 && (
                    <p className={'text-sm mt-1'}>{day.format('ddd').toUpperCase()}</p>
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
                    console.log("TRIGGER MODAL FROM DAY")
                    setShowEventModal(true);
                }}>
                {dayEvents.map((evt, idx) => (
                    <div
                        key={idx}
                        onClick={() => {setSelectedEvent(evt); console.log(evt)}}
                        className={`bg-${evt.label || 'default'}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
                    >
                        {evt.title}
                    </div>
                ))}
            </div>
        </div>
    );
}