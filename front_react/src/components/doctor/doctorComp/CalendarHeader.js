import React, {useContext, useEffect, useState} from 'react';


import logo from '../../../assets/health.png';
import user_32IMG from '../../../assets/icons8-user-50.png';
import GlobalContext from "../../../context/GlobalContext";
import dayjs from "dayjs";
import ActiveHoursModal from "./ActiveHoursModal";
import UserService from "../../../services/UserService";
import { useNavigate } from "react-router-dom";


export default function CalendarHeader() {
    const {monthIndex,
        setMonthIndex,
        showActiveHoursModal,
        setShowActiveHoursModal,
        showSearchAppointments,
        showRegisterPatient,
        userAuthed,
        showSearchPatients,
        showRegisterPatientMassively,
        showCreateHistoryReg,
        showConfigureHistoryReg,
        showDisplayAllHistory,
        showRegisterPatientHistoryMassively
    } = useContext(GlobalContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    function handlePrevMonth() {
        setMonthIndex(monthIndex - 1);
    }

    function handleNextMonth() {
        setMonthIndex(monthIndex + 1);
    }

    /* if we keep the code like this: setMonthIndex(dayjs().month()) then when the user interacts only with the
    *  small calendar and then press the Today button the button will not work, because the dayjs().month() only
    *  works if the month is not equal to the current */
    function handleReset() {
        setMonthIndex( monthIndex === dayjs().month() ? monthIndex + Math.random() : dayjs().month());
    }

    function toggleMenu() {
        setMenuOpen(!menuOpen);
    }

    /* If the Modal for active hours is not alrady shown then set showActiveHoursModal to true. */
    function showActiveHoursModalHandler() {
        setShowActiveHoursModal(true);
    }

    function closeActiveHoursModal() {
        setShowActiveHoursModal(false);
    }

    return (
        <>
            <header className={'px-4 py-2 flex items-center bg-gradient-to-l from-blue-200 shadow-sm'}>
                <img src={logo} alt={'Calendar'} className="mr-2 w-12 h-12 sm:w-10 sm:h-10"/>
                <h1 className={'mr-10 text-xl text-gray-500 font-bold hidden sm:block'}>HealthSyS</h1>

                {
                    showSearchAppointments === false
                    && showRegisterPatient === false
                    && showSearchPatients === false
                    && showRegisterPatientMassively === false
                    && showCreateHistoryReg === false
                    && showConfigureHistoryReg === false
                    && showDisplayAllHistory === false
                    && showRegisterPatientHistoryMassively === false ? (
                        <>
                            <button className="border rounded py-2 px-1 sm:px-4 mr-2 sm:mr-5 text-xs sm:text-base"
                                    onClick={handleReset}>
                                Today
                            </button>

                            <button onClick={handlePrevMonth}>
                            <span
                                className="material-icons-outlined cursor-pointer text-gray-600 mx-2 lg:text-2xl text-sm">
                                chevron_left
                            </span>
                            </button>
                            <button onClick={handleNextMonth}>
                            <span
                                className="material-icons-outlined cursor-pointer text-gray-600 mx-2 lg:text-2xl text-sm">
                                chevron_right
                            </span>
                            </button>
                            <h2 className="ml-4 text-xl text-gray-500 font-bold text-xs sm:text-base">
                                {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
                            </h2>
                        </>
                    ) : (<div></div>)
                }


                <div className="flex items-center ml-auto gap-2">
                    <div className="grid grid-rows-2 grid-cols-1 justify-items-end">
                        <span className="text-gray-600 text-sm sm:text-lg">{userAuthed.username}</span>
                        <span className="text-gray-600 text-xs sm:text-xs">
                            {
                                userAuthed.role === "USER_DOCTOR" ? 'Doctor' :
                                    userAuthed.role === "USER_PATIENT" ? 'Patient' :
                                        userAuthed.role === "USER_SECRETARY" ? 'Secretary' : 'Role undefined'
                            }
                        </span>
                    </div>
                    <div className="ml-auto">
                        <div className="flex items-center cursor-pointer" onClick={toggleMenu}>
                            <img src={user_32IMG} alt="User Icon" className="w-8 h-8 rounded-full mr-2"/>
                        </div>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                                <a className="block px-4 cursor-default py-2 text-gray-800 hover:bg-green-200 rounded"
                                   onClick={showActiveHoursModalHandler}>Working hours</a>
                                <a className="block px-4 cursor-default py-2 text-gray-800 hover:bg-gray-200">Settings</a>
                                <a
                                    className="block px-4 cursor-default py-2 text-gray-800 hover:bg-red-200"
                                    onClick={() => {
                                        UserService.logout();
                                        navigate("/auth", {replace: true});
                                    }}
                                >
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {showActiveHoursModal && <ActiveHoursModal onClose={closeActiveHoursModal}/>}
    </>
    );
}