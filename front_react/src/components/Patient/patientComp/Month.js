import React from 'react'
import Day from "./Day";

export default function Month({appointmentsMonth, month}) {

    /* Iterate the list appointmentsMonth and take the appointments that are equal with the day being rendered */
    function getAppointmentsForDayOfTheMonth(day) {
        if(appointmentsMonth !== null) {
            for (const dayOfMonth of appointmentsMonth) {
                for (const appoint of dayOfMonth) {
                    if (appoint.appointmentDate === day.format('YYYY-MM-DD')) {
                        return dayOfMonth
                    }
                }
            }
        }
        return appointmentsMonth
    }

    return (
        <div className={'flex-1 grid grid-cols-7 grid-rows-5'}>
            {month.map((row, index) => (
                <React.Fragment key={index}>
                    {row.map((day, idx) => (
                        <Day appointmentsOfTheDay={getAppointmentsForDayOfTheMonth(day)} day={day} key={idx} rowIdx={index}/>
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
}