import React, { useState, useContext, useEffect } from "react";
import './DoctorApp.css';
import { getMonth } from './util'
import CalendarHeader from "./doctorComp/CalendarHeader";
import SideBar from "./doctorComp/SideBar";
import Month from "./doctorComp/Month";
import GlobalContext from "../../context/GlobalContext";
import EventModal from "./doctorComp/EventModal";
import InsertModal from "./doctorComp/InsertModal";
import SearchAppointments from "./doctorComp/SearchAppointments";
import UserService from "../../services/UserService";
import LoadingApp from "../Loading/LoadingApp";
import RegisterPatient from "./doctorComp/RegisterPatient";

function DoctorApp() {
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const [appointmentsMonth, setAppointmentsMonth] = useState(null)
    const {
        monthIndex,
        showEventModal,
        showInsertModal,
        showSearchAppointments,
        setShowSearchAppointments,
        userAuthed,
        setUserAuthed,
        reloadDoctorApp,
        showRegisterPatient,
        setShowRegisterPatient
    } = useContext(GlobalContext);

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));

        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await UserService.getUserDetails(token);
                    setUserAuthed({
                        username: userData.users.user_name,
                        email: userData.users.email,
                        surname: userData.users.user_surname,
                        role: userData.users.role_str,
                    });
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            } else {
                console.log("No token found");
            }
        };
        fetchUserData()
        console.log(currentMonth)
    }, [monthIndex])

    /* We need to fetch the appointments for the current month (the user is viewing).
    *  These appointments will be displayed as boxes in each day */
    React.useEffect(() => {
        const fetchAppointmentsForMonth = async () => {
            try {
                const appointments = await UserService.getAllForAMonthAppointments(extractDate());
                setAppointmentsMonth(appointments)
            } catch (error) {
                console.error('Failed to fetch appointments for the month:', error);
            }
        }
        fetchAppointmentsForMonth();
    }, [currentMonth, reloadDoctorApp])

    /* Create a JSON with all the dates that are in the current Month */
    function extractDate() {
        const dates = [];
        for (let week of currentMonth) {
            for (let day of week) {
                dates.push(day.format('YYYY-MM-DD'));
            }
        }
        return dates;
    }



    return (
        <>
            {userAuthed ? (
                <>
                    {showEventModal && <EventModal />}
                    {showInsertModal && <InsertModal />}
                    <div className={'h-screen flex flex-col bg-gradient-to-l from-slate-300'}>
                        <CalendarHeader />
                        <div className={'flex flex-1'}>
                            <SideBar />
                            {(() => {
                                if (!showSearchAppointments && !showRegisterPatient) {
                                    return <Month appointmentsMonth={appointmentsMonth} month={currentMonth} />;
                                } else if (showSearchAppointments) {
                                    setShowRegisterPatient(false)
                                    return <SearchAppointments />;
                                } else if (showRegisterPatient) {
                                    setShowSearchAppointments(false)
                                    return <RegisterPatient />;
                                } else {
                                    return null;
                                }
                            })()}
                        </div>
                    </div>
                </>
            ) : (
                <LoadingApp/>
            )}
        </>
    );
}

export default DoctorApp;
