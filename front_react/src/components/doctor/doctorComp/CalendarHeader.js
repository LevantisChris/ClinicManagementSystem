import React, {useContext, useEffect, useState} from 'react';


import logo from '../../../assets/health.png';
import user_32IMG from '../../../assets/icons8-user-50.png';
import GlobalContext from "../../../context/GlobalContext";
import dayjs from "dayjs";
import DescriptionInsertModal from "./DescriptionInsertModal";
import ActiveHoursModal from "./ActiveHoursModal";
import {useNavigate} from "react-router-dom";
import UserService from "../../../services/UserService";

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
        showDisplayAllHistory
    } = useContext(GlobalContext);
    const [menuOpen, setMenuOpen] = useState(false);


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
                <img src={logo} alt={'Calendar'} className={'mr-2 w-12 h-12'}/>
                <h1 className={'mr-10 text-xl text-gray-500 font-bold'}>HealthSyS</h1>

                {
                    showSearchAppointments === false
                    && showRegisterPatient === false
                    && showSearchPatients === false
                    && showRegisterPatientMassively === false
                    &&  showCreateHistoryReg === false
                    && showConfigureHistoryReg === false
                    && showDisplayAllHistory === false ? (
                        <>
                            <button className="border rounded py-2 px-4 mr-5" onClick={handleReset}>
                                Today
                            </button>
                            <button onClick={handlePrevMonth}>
                            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
                                chevron_left
                            </span>
                                        </button>
                                        <button onClick={handleNextMonth}>
                            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
                                chevron_right
                            </span>
                            </button>
                            <h2 className="ml-4 text-xl text-gray-500 font-bold">
                                {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
                            </h2>
                        </>
                    ) : (<div></div>)
                }


                <div className="flex items-center ml-auto gap-2">
                    <div className="grid grid-rows-2 grid-cols-1 justify-items-end">
                        <span className="text-gray-600">{userAuthed.username}</span>
                        <span className="text-gray-600 text-xs">
                            {
                                userAuthed.role === "USER_DOCTOR" ? 'Doctor' :
                                userAuthed.role === "USER_PATIENT" ? 'Patient' :
                                userAuthed.role === "USER_SECRETARY" ? 'Secretary' : 'Role undefined'
                            }
                        </span>
                    </div>
                    <div className="ml-auto relative">
                        <div className="flex items-center cursor-pointer" onClick={toggleMenu}>
                            <img src={user_32IMG} alt="User Icon" className="w-8 h-8 rounded-full mr-2"/>
                        </div>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={showActiveHoursModalHandler}>Working hours</a>
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Settings</a>
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</a>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {showActiveHoursModal && <ActiveHoursModal onClose={closeActiveHoursModal}/>}
    </>
    );
}