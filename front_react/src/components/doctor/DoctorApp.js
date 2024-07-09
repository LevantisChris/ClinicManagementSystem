import React, { useState, useContext, useEffect } from "react";
import './DoctorApp.css';
import { getMonth } from './util'
import CalendarHeader from "./doctorComp/CalendarHeader";
import SideBar from "./doctorComp/SideBar";
import Month from "./doctorComp/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./doctorComp/EventModal";
import InsertModal from "./doctorComp/InsertModal";
import SearchAppointments from "./doctorComp/SearchAppointments";

function DoctorApp() {
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const {
        monthIndex,
        showEventModal,
        showInsertModal,
        showSearchAppointments
    } = useContext(GlobalContext);

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex])

    return (
        <React.Fragment>
            {showEventModal === true && <EventModal/>}
            {showInsertModal === true && <InsertModal/>}
            <div className={'h-screen flex flex-col'}>
                <CalendarHeader />
                <div className={'flex flex-1'}>
                    <SideBar/>
                    {showSearchAppointments === false ? <Month month={currentMonth}/> : <SearchAppointments/>}
                </div>
            </div>
        </React.Fragment>
    );
}

export default DoctorApp;
