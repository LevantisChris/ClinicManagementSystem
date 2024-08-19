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

function DoctorApp() {
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const {
        monthIndex,
        showEventModal,
        showInsertModal,
        showSearchAppointments,
        userAuthed,
        setUserAuthed
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
    }, [monthIndex])

    /* We need to fetch the appointments for the current month (the user is viewing).
    *  These appointments will be displayed as boxes in each day */
    React.useEffect(() => {
        const fetchAppointmentsForMonth = async () => {
            try {
                const appointments = await UserService.getAllForAMonthAppointments(extractDate());
                console.log(appointments)
            } catch (error) {
                console.error('Failed to fetch appointments for the month:', error);
            }
        }
        fetchAppointmentsForMonth();
    }, [currentMonth])

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
                    <div className={'h-screen flex flex-col'}>
                        <CalendarHeader />
                        <div className={'flex flex-1'}>
                            <SideBar />
                            {showSearchAppointments === false ? <Month month={currentMonth} /> : <SearchAppointments />}
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
