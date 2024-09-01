import React, {useContext, useState} from 'react'
import CreateEventButton from './CreateEventButton'
import SmallCalendar from "./SmallCalendar";
import SideBarCSS from "./compCSS/SideBarCSS.css"
import GlobalContext from "../../../context/GlobalContext";

export default function SideBar() {
    const [activeCategory, setActiveCategory] = useState(null); // for dynamic sub-categories

    const handleCategoryClick = (category) => {
        setActiveCategory(activeCategory === category ? null : category);
    };

    const {
        showSearchAppointments,
        setShowSearchAppointments,
        showRegisterPatient,
        setShowRegisterPatient,
        showSearchPatients,
        setShowSearchPatients,
        showRegisterPatientMassively,
        setShowRegisterPatientMassively,
        showCreateHistoryReg,
        setShowCreateHistoryReg,
        showConfigureHistoryReg,
        setShowConfigureHistoryReg
    } = useContext(GlobalContext);

    return (
        <aside className={'p-5 shadow-2xl'}>
            <div className={"w-64 scrollable-sidebar"}>
                <CreateEventButton/>
                <SmallCalendar/>

                <div className="w-64 bg-white text-gray-600 rounded-xl border-4">
                    <div className="p-4">
                        <h1 className="text-2xl font-bold">Functions</h1>
                    </div>
                    <nav className="cursor-pointer">
                        <div>
                            <a
                                onClick={() => handleCategoryClick('home')}
                                className="m-1 bg-gray-200 block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-400 hover:text-white"
                            >
                                <div className="flex items-center">
                                    <span className="material-icons-outlined">
                                        handshake
                                    </span>
                                    <span className="ml-2">Manage Appointments</span>
                                </div>
                            </a>

                            {activeCategory === 'home' && (
                                    <div className="ml-4">
                                        <div className={"flex items-center ml-5"}>
                                            <span className="material-icons-outlined text-sm">
                                                arrow_forward_ios
                                            </span>
                                            <a
                                                className="block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                                onClick={() => (showSearchAppointments === false ? setShowSearchAppointments(true) : setShowSearchAppointments(false))}>
                                                Search & View Appointments
                                            </a>
                                        </div>
                                    </div>
                            )}
                        </div>
                        <div>
                            <a
                                href="#"
                                onClick={() => handleCategoryClick('about')}
                                className="m-1 bg-gray-200 block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-400 hover:text-white"
                            >
                                <div className="flex items-center">
                                    <span className="material-icons-outlined">
                                        personal_injury
                                    </span>
                                    <span className="ml-2">Manage Patients</span>
                                </div>
                            </a>

                            {activeCategory === 'about' && (
                                <div className="ml-4">
                                    <div className={"flex items-center ml-5"}>
                                            <span className="material-icons-outlined text-sm">
                                                arrow_forward_ios
                                            </span>
                                        <a
                                            className="block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                            onClick={() => (showRegisterPatient === false ? setShowRegisterPatient(true) : setShowRegisterPatient(false))}
                                        >
                                            Register patients
                                        </a>
                                    </div>
                                    <div className={"flex items-center ml-5"}>
                                            <span className="material-icons-outlined text-sm">
                                                arrow_forward_ios
                                            </span>
                                        <a
                                            className="block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                            onClick={() => (showSearchPatients === false ? setShowSearchPatients(true) : setShowSearchPatients(false))}
                                        >
                                            Search patients
                                        </a>
                                    </div>
                                    <div className={"flex items-center ml-5"}>
                                            <span className="material-icons-outlined text-sm">
                                                arrow_forward_ios
                                            </span>
                                        <a
                                            className="block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                            onClick={() => (showRegisterPatientMassively === false ? setShowRegisterPatientMassively(true) : setShowRegisterPatientMassively(false))}
                                        >
                                            Register patients massively
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>

                            <a
                                href="#"
                                onClick={() => handleCategoryClick('services')}
                                className="m-1 bg-gray-200 block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-400 hover:text-white"
                            >
                                <div className="flex items-center">
                                    <span className="material-icons-outlined">
                                        history
                                    </span>
                                    <span className="ml-2">Manage Patient History</span>
                                </div>
                            </a>

                            {activeCategory === 'services' && (
                                <div className="ml-4">
                                    <div className={"flex items-center ml-5"}>
                                            <span className="material-icons-outlined text-sm">
                                                arrow_forward_ios
                                            </span>
                                        <a
                                            className="block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                            onClick={() => (showCreateHistoryReg === false ? setShowCreateHistoryReg(true) : setShowCreateHistoryReg(false))}
                                        >
                                            Create history registration
                                        </a>
                                    </div>
                                    <div className={"flex items-center ml-5"}>
                                            <span className="material-icons-outlined text-sm">
                                                arrow_forward_ios
                                            </span>
                                        <a
                                            className="block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                            onClick={() => (showConfigureHistoryReg === false ? setShowConfigureHistoryReg(true) : setShowConfigureHistoryReg(false))}
                                        >
                                            Configure last patient registration
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </aside>);
}