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
import LoadingApp from "../../Loading/LoadingApp";
import RegisterPatient from "./doctorComp/RegisterPatient";
import SearchPatients from "./doctorComp/SearchPatients";
import RegisterPatientsMassively from "./doctorComp/RegisterPatientsMassively";
import CreateHistoryReg from "./doctorComp/CreateHistoryReg";
import ConfigureHistoryReg from "./doctorComp/ConfigureHistoryReg";
import {DisplayAllHistory} from "./doctorComp/DisplayAllHistory";
import CreatePatientsHistoryMassively from "./doctorComp/CreatePatientsHistoryMassively";
import {useNavigate} from "react-router-dom";

function DoctorApp() {
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const [appointmentsMonth, setAppointmentsMonth] = useState(null)
    const navigate = useNavigate();
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
        setShowRegisterPatient,
        showSearchPatients,
        setShowSearchPatients,
        showRegisterPatientMassively,
        setShowRegisterPatientMassively,
        showCreateHistoryReg,
        setShowCreateHistoryReg,
        showConfigureHistoryReg,
        setShowConfigureHistoryReg,
        showDisplayAllHistory,
        setShowDisplayAllHistory,
        showRegisterPatientHistoryMassively,
        setShowRegisterPatientHistoryMassively
    } = useContext(GlobalContext);

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));

        const fetchUserData = async () => {
            console.log("DOCTOR DATA FETCED")
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
                    if(userData.users.role_str !== "USER_DOCTOR") {
                        console.log("NOT A DOCTOR")
                        UserService.logout()
                        navigate("/auth")
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    UserService.logout()
                    navigate("/auth")
                }
            } else {
                console.log("No token found");
                UserService.logout()
                navigate("/auth")
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
                    {/*{showEventModal && <EventModal />}*/}
                    {showInsertModal && <InsertModal />}
                    <div className={'h-screen flex flex-col'}>
                        <CalendarHeader />
                        <div className={'flex flex-1'}>
                            <SideBar />
                            {(() => {
                                if (!showSearchAppointments
                                    && !showRegisterPatient
                                    && !showSearchPatients
                                    && !showRegisterPatientMassively
                                    && !showCreateHistoryReg
                                    && !showConfigureHistoryReg
                                    && !showDisplayAllHistory
                                    && !showRegisterPatientHistoryMassively) {
                                    return <Month appointmentsMonth={appointmentsMonth} month={currentMonth} />;
                                } else if (showSearchAppointments) {
                                    setShowRegisterPatientMassively(false)
                                    setShowRegisterPatient(false)
                                    setShowSearchPatients(false)
                                    setShowCreateHistoryReg(false)
                                    setShowConfigureHistoryReg(false)
                                    setShowDisplayAllHistory(false)
                                    setShowRegisterPatientHistoryMassively(false)
                                    return <SearchAppointments />;
                                } else if (showRegisterPatient) {
                                    setShowRegisterPatientMassively(false)
                                    setShowSearchAppointments(false)
                                    setShowSearchPatients(false)
                                    setShowCreateHistoryReg(false)
                                    setShowConfigureHistoryReg(false)
                                    setShowDisplayAllHistory(false)
                                    setShowRegisterPatientHistoryMassively(false)
                                    return <RegisterPatient />;
                                } else if(showSearchPatients){
                                    setShowRegisterPatientMassively(false)
                                    setShowSearchAppointments(false)
                                    setShowRegisterPatient(false)
                                    setShowCreateHistoryReg(false)
                                    setShowConfigureHistoryReg(false)
                                    setShowDisplayAllHistory(false)
                                    setShowRegisterPatientHistoryMassively(false)
                                    return <SearchPatients/>;
                                } else if(showRegisterPatientMassively) {
                                    setShowRegisterPatient(false)
                                    setShowSearchAppointments(false)
                                    setShowRegisterPatient(false)
                                    setShowCreateHistoryReg(false)
                                    setShowConfigureHistoryReg(false)
                                    setShowDisplayAllHistory(false)
                                    setShowRegisterPatientHistoryMassively(false)
                                    return <RegisterPatientsMassively/>
                                } else if(showCreateHistoryReg) {
                                    setShowRegisterPatientMassively(false)
                                    setShowRegisterPatient(false)
                                    setShowSearchAppointments(false)
                                    setShowRegisterPatient(false)
                                    setShowConfigureHistoryReg(false)
                                    setShowDisplayAllHistory(false)
                                    setShowRegisterPatientHistoryMassively(false)
                                    return <CreateHistoryReg/>
                                } else if (showConfigureHistoryReg) {
                                    setShowRegisterPatientMassively(false)
                                    setShowRegisterPatient(false)
                                    setShowSearchAppointments(false)
                                    setShowRegisterPatient(false)
                                    setShowCreateHistoryReg(false)
                                    setShowDisplayAllHistory(false)
                                    setShowRegisterPatientHistoryMassively(false)
                                    return <ConfigureHistoryReg/>
                                } else if(showDisplayAllHistory) {
                                    setShowRegisterPatientMassively(false)
                                    setShowRegisterPatient(false)
                                    setShowSearchAppointments(false)
                                    setShowRegisterPatient(false)
                                    setShowCreateHistoryReg(false)
                                    setShowConfigureHistoryReg(false)
                                    setShowRegisterPatientHistoryMassively(false)
                                    return <DisplayAllHistory/>
                                } else if(showRegisterPatientHistoryMassively) {
                                    setShowRegisterPatientMassively(false)
                                    setShowRegisterPatient(false)
                                    setShowSearchAppointments(false)
                                    setShowRegisterPatient(false)
                                    setShowCreateHistoryReg(false)
                                    setShowDisplayAllHistory(false)
                                    setShowConfigureHistoryReg(false)
                                    return <CreatePatientsHistoryMassively/>
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
