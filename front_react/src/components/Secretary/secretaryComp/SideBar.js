import React, {useContext, useState} from 'react'
import CreateEventButton from './CreateEventButton'
import SmallCalendar from "./SmallCalendar";
import SideBarCSS from "./compCSS/SideBarCSS.css"
import GlobalContext from "../../../context/GlobalContext";
import {Button} from "@material-tailwind/react";

export default function SideBar() {

    const {
        viewEnglish
    } = useContext(GlobalContext)

    const [activeCategory, setActiveCategory] = useState(null); // for dynamic sub-categories

    const handleCategoryClick = (category) => {
        setActiveCategory(activeCategory === category ? null : category);
    };



    const [isOpen, setIsOpen] = useState(false); // State to control side nav

    const toggleSideNav = () => {
        setIsOpen(!isOpen);
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
    } = useContext(GlobalContext);

    return (
        <>
            <aside className={'p-5 shadow-2xl hidden sm:block'}>
                <div className={"w-64 scrollable-sidebar"}>
                    {/*<CreateEventButton/>*/}
                    <SmallCalendar/>

                    <div className="w-64 bg-white text-gray-600 rounded-xl border-4">
                        <div className="p-4">
                            <h1 className="text-2xl font-bold">{viewEnglish ? "Functions" : "Λειτουργίες"}</h1>
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
                                        <span className="ml-2">{viewEnglish ? "Manage Appointments" : "Διαχείριση ραντεβού"}</span>
                                    </div>
                                </a>

                                {activeCategory === 'home' && (
                                    <div className="ml-4">
                                        <div className={"flex items-center ml-5"}>
                                                <span className="material-icons-outlined text-sm">
                                                    arrow_forward_ios
                                                </span>
                                            <a
                                                className={
                                                    showSearchAppointments === false
                                                        ? "block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                                        : "block py-2.5 px-4 text-sm rounded transition duration-200 bg-blue-400 text-white"
                                                }

                                                onClick={() => (showSearchAppointments === false ? setShowSearchAppointments(true) : setShowSearchAppointments(false))}>
                                                {viewEnglish ? "Search & View Appointments" : "Αναζήτηση & Προβολή Ραντεβού"}
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
                                        <span className="ml-2">
                                            {viewEnglish ? "Manage Patients" : "Διαχείριση Ασθενών"}
                                        </span>
                                    </div>
                                </a>

                                {activeCategory === 'about' && (
                                    <div className="ml-4">
                                        <div className={"flex items-center ml-5"}>
                                                <span className="material-icons-outlined text-sm">
                                                    arrow_forward_ios
                                                </span>
                                            <a
                                                className={
                                                    !showRegisterPatient
                                                        ? "block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                                        : "block py-2.5 px-4 text-sm rounded transition duration-200 bg-blue-400 text-white"
                                                }
                                                onClick={() => (showRegisterPatient === false ? setShowRegisterPatient(true) : setShowRegisterPatient(false))}
                                            >
                                                {viewEnglish ? "Register patients" : "Εισαγωγή ασθενών"}
                                            </a>
                                        </div>
                                        <div className={"flex items-center ml-5"}>
                                                <span className="material-icons-outlined text-sm">
                                                    arrow_forward_ios
                                                </span>
                                            <a
                                                className={
                                                    !showSearchPatients
                                                        ? "block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                                        : "block py-2.5 px-4 text-sm rounded transition duration-200 bg-blue-400 text-white"
                                                }
                                                onClick={() => (showSearchPatients === false ? setShowSearchPatients(true) : setShowSearchPatients(false))}
                                            >
                                                {viewEnglish ? "Search patients" : "Αναζήτηση ασθενών"}
                                            </a>
                                        </div>
                                        <div className={"flex items-center ml-5"}>
                                                <span className="material-icons-outlined text-sm">
                                                    arrow_forward_ios
                                                </span>
                                            <a
                                                className={
                                                    !showRegisterPatientMassively
                                                        ? "block py-2.5 px-4 text-sm rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                                        : "block py-2.5 px-4 text-sm rounded transition duration-200 bg-blue-400 text-white"
                                                }
                                                onClick={() => (showRegisterPatientMassively === false ? setShowRegisterPatientMassively(true) : setShowRegisterPatientMassively(false))}
                                            >
                                                {viewEnglish ? "Register patients massively" : "Εισαγωγή ασθενών μαζικά"}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </aside>


            <div className={"relative z-49 md:hidden"}>
                {/* Button to toggle side nav */}
                <button className="sm:hidden p-2 text-white rounded" onClick={toggleSideNav}>
                   <span className="material-icons-outlined text-3xl text-blue-700">
                       menu_open
                   </span>
                </button>

                {/* Side navigation */}
                <nav
                    className={`fixed top-0 left-0 w-64 h-full bg-gray-100 shadow-lg transition-transform transform cursor-default ${
                        isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:hidden sm:translate-x-0 sm:w-auto sm:h-auto sm:bg-transparent`}
                >
                    <div className="p-4">
                        {/* Close button for small screens */}
                        <Button className="sm:hidden w-full mb-4 p-2 bg-blue-600 text-white rounded"
                                onClick={toggleSideNav}>
                            {viewEnglish ? "Close Menu" : "Κλεισιμο"}
                        </Button>

                        <p className={'font-bold'}>
                            {viewEnglish ? "Functions" : "Λειτουργίες"}
                        </p>

                        <div>
                            <a
                                onClick={() => handleCategoryClick('home')}
                                className="m-1 bg-gray-200 block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-400 hover:text-white"
                            >
                                <div className="flex items-center">
                                    <span className="material-icons-outlined">handshake</span>
                                    <span className="ml-2 text-sm">{viewEnglish ? "Manage Appointments" : "Διαχείριση Ραντεβού"}</span>
                                </div>
                            </a>

                            {activeCategory === 'home' && (
                                <div className="ml-4">
                                    <div className="flex items-center ml-5">
                                        <span className="material-icons-outlined text-sm">arrow_forward_ios</span>
                                        <a
                                            className={`${
                                                showSearchAppointments
                                                    ? 'block py-2.5 px-4 text-xs rounded transition duration-200 bg-blue-400 text-white'
                                                    : 'block py-2.5 px-4 text-xs rounded transition duration-200 hover:bg-blue-300 hover:text-white'
                                            }`}
                                            onClick={() => setShowSearchAppointments(!showSearchAppointments)}
                                        >
                                            {viewEnglish ? "Search & View Appointments" : "Αναζήτηση & Προβολή Ραντεβού"}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <a
                                onClick={() => handleCategoryClick('about')}
                                className="m-1 bg-gray-200 block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-400 hover:text-white"
                            >
                                <div className="flex items-center">
                                    <span className="material-icons-outlined">personal_injury</span>
                                    <span className="ml-2 text-sm">{viewEnglish ? "Manage Patients" : "Διαχείριση Ασθενών"}</span>
                                </div>
                            </a>

                            {activeCategory === 'about' && (
                                <div className="ml-4">
                                    <div className="flex items-center ml-5">
                                        <span className="material-icons-outlined text-sm">arrow_forward_ios</span>
                                        <a
                                            className={`${
                                                showRegisterPatient
                                                    ? 'block py-2.5 px-4 text-xs rounded transition duration-200 bg-blue-400 text-white'
                                                    : 'block py-2.5 px-4 text-xs rounded transition duration-200 hover:bg-blue-300 hover:text-white'
                                            }`}
                                            onClick={() => setShowRegisterPatient(!showRegisterPatient)}
                                        >
                                            {viewEnglish ? "Register patients" : "Εισαγωγή ασθενών"}
                                        </a>
                                    </div>
                                    <div className={"flex items-center ml-5"}>
                                                <span className="material-icons-outlined text-sm">
                                                    arrow_forward_ios
                                                </span>
                                        <a
                                            className={
                                                !showSearchPatients
                                                    ? "block py-2.5 px-4 text-xs rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                                    : "block py-2.5 px-4 text-xs rounded transition duration-200 bg-blue-400 text-white"
                                            }
                                            onClick={() => (showSearchPatients === false ? setShowSearchPatients(true) : setShowSearchPatients(false))}
                                        >
                                            {viewEnglish ? "Search patients" : "Αναζήτηση ασθενών"}
                                        </a>
                                    </div>
                                    <div className={"flex items-center ml-5"}>
                                                <span className="material-icons-outlined text-sm">
                                                    arrow_forward_ios
                                                </span>
                                        <a
                                            className={
                                                !showRegisterPatientMassively
                                                    ? "block py-2.5 px-4 text-xs rounded transition duration-200 hover:bg-blue-300 hover:text-white"
                                                    : "block py-2.5 px-4 text-xs rounded transition duration-200 bg-blue-400 text-white"
                                            }
                                            onClick={() => (showRegisterPatientMassively === false ? setShowRegisterPatientMassively(true) : setShowRegisterPatientMassively(false))}
                                        >
                                            {viewEnglish ? "Register patients massively" : "Εισαγωγή ασθενών μαζικά"}
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
                                    <span className="ml-2 text-sm">{viewEnglish ? "Manage Patient History" : "Διαχείριση Ιστορικού Ασθενούς"}</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>


        </>
    );
}