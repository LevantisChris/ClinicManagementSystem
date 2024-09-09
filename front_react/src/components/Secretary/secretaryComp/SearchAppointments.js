import React, {useContext, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import Calendar from "react-calendar";
import UserService from "../../../services/UserService";
import DescriptionInsertModal from "./DescriptionInsertModal";
import DisplayInfoAppointment from "./DisplayInfoAppointment";
import GlobalContext from "../../../context/GlobalContext";


export default function SearchAppointments() {

    const {
        viewDisplayAppointmentComponent,
        setViewDisplayAppointmentComponent,
        viewEnglish
    } = useContext(GlobalContext);

    /* To keep track of the filter selected */
    const [selectedFilter, setSelectedFilter] = useState('none');
    /* For the input value */
    const [inputAMKAValue, setInputAMKAValue] = useState('');
    const [inputSurnameValue, setInputSurnameValue] = useState('');
    /* List with all the appointments resolved from the search */
    const [appointmentsResolvedList, setAppointmentsResolvedList] = useState([])
    /* The appointment the user wants to see the details */
    const [appointmentToView, setAppointmentToView] = useState(false)

    /* This state is for handling the option
    *  selected for the filter Appointment state
    *  default is Created. */
    const [filterAppointStateSelectedOption, setFilterAppointStateSelectedOption] =
        useState("Created");

    const [showStartDateCalendar, setShowStartDateCalendar] =
        useState(false);

    const [showEndDateCalendar, setShowEndDateCalendar] =
        useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleSelectedFilter = (event) => {
        if(event.target.value === "surname") {
            setInputAMKAValue("")
            setFilterAppointStateSelectedOption("")
        } else if(event.target.value === "AMKA") {
            setInputSurnameValue("")
            setFilterAppointStateSelectedOption("")
        } else if(event.target.value === "appointState") {
            setInputSurnameValue("")
            setInputAMKAValue("")
        } else if(event.target.value === "date") {
            setInputSurnameValue("")
            setInputAMKAValue("")
            setFilterAppointStateSelectedOption("")
        }
        setSelectedFilter(event.target.value);
    };

    const handleSelectedState = (event) => {
        setFilterAppointStateSelectedOption(event.target.value);
    };

    /* Start date calendar */
    const handleStartDateCalendarClick = () => {
        setShowStartDateCalendar(true)
    };

    const handleEndDateCalendarClick = () => {
        setShowEndDateCalendar(true);
    }

    const handleStartDateCloseCalendar = () => {
        setShowStartDateCalendar(false); // This function closes the calendar modal
    };

    const handleStartDateChange = (newDate) => {
        setStartDate(newDate);
        handleStartDateCloseCalendar();
    };

    function handleEndDateCloseCalendar() {
        setShowEndDateCalendar(false);
    }

    const handleEndDateChange = (newDate) => {
        setEndDate(newDate);
        handleEndDateCloseCalendar()
    };

    const handleInputAMKAChange = (event) => {
        setInputAMKAValue(event.target.value);
    };

    const handleInputSurnameChange = (event) => {
        setInputSurnameValue(event.target.value)
    }

    function formatDateToLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /* Create the JSON request object and send it in the backend  */
    async function handleSubmitButtonClick() {
        let searchCriteria = {}
        if (selectedFilter !== "none") {
            searchCriteria = {
                patientSurname: inputSurnameValue,
                appointmentPatientAMKA: inputAMKAValue,
                appointmentStateId:
                    filterAppointStateSelectedOption === "appointState_Canceled" ? 4
                        : filterAppointStateSelectedOption === "appointState_Created" ? 1
                            : filterAppointStateSelectedOption === "appointState_Respected" ? 2
                                : filterAppointStateSelectedOption === "appointState_Completed" ? 3
                                    : "",
                startDate:
                    inputSurnameValue === "" && inputAMKAValue === "" && filterAppointStateSelectedOption === "" ?
                        (startDate !== null && startDate !== undefined ? formatDateToLocal(startDate) : "") : "",
                endDate: inputSurnameValue === "" && inputAMKAValue === "" && filterAppointStateSelectedOption === "" ?
                    (endDate !== null && endDate !== undefined ? formatDateToLocal(endDate) : "") : ""
            };
        } else {
            alert("You have not selected any search criteria, searching any appointments for today.")
            searchCriteria = {patientSurname: "", appointmentPatientAMKA: "", startDate: "", endDate: ""}
        }

        const response = await UserService.searchAppointment(searchCriteria)
        if (response.statusCode === 200) {
            setAppointmentsResolvedList(response.appointmentList)
            //setLoading(false)
        } else {
            setAppointmentsResolvedList([]) // empty
            //setLoading(false)
        }
    }

    async function handleViewAppointment(appointmentId) {
        const response = await UserService.displayAppointmentBasedOnId(appointmentId)
        console.log(response)
        if (response.statusCode === 200) {
            setAppointmentToView(response)
            setViewDisplayAppointmentComponent(true)
            //setLoading(false)
        } else {
            console.log("ERROR")
            //setLoading(false)
        }
        return undefined;
    }

    /* pagination settings */

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const totalItems = (appointmentsResolvedList !== null)
        ? appointmentsResolvedList.length
        :  0;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const paginatedData = (appointmentsResolvedList !== null)
        ? getPaginatedData(appointmentsResolvedList)
        : [];

    /*-------------------------------------------------------------*/

    return (
        <div className="flex flex-col h-min w-full p-5">
            <p className={"font-light text-2xl sm:text-5xl"}>
                {viewEnglish ? "Search & View appointments" : "Αναζήτηση & Προβολή ραντεβού"}
            </p>
            <p className={"mt-2 font-light text-slate-400 text-xs sm:text-lg"}>
                {viewEnglish ? "If you dont give any search criteria, all the appointments for the current day will be returned" : "Αν δεν εισάγετε κριτίρια αναζήτησης, όλα τα ρεντεβού τα επιστραφούν"}
            </p>
            <div className={`grid ${selectedFilter === 'date' ? 'grid-cols-4' : 'grid-cols-3'} p-4 gap-4 h-min`}>
                {/* Choice Box */}
                <div className="w-full">
                    <select
                        className="border p-1 sm:p-3 rounded w-full shadow-sm text-xs sm:text-base"
                        value={selectedFilter}
                        onChange={handleSelectedFilter}
                    >
                        <option value="today_appointments">{viewEnglish ? "Today Appointments" : "Σημερινά ραντεβού"}</option>
                        <option value="surname">{viewEnglish ? "By Surname" : "Με βάση επώνυμο"}</option>
                        <option value="AMKA">{viewEnglish ? "By AMKA" : "Με βάση AMKA"}</option>
                        <option value="appointState">{viewEnglish ? "By Appoin. state" : "Με βάση κατάσταση ραντεβού"}</option>
                        <option value="date">{viewEnglish ? "By Date" : "Με βάση ημερομηνία"}</option>
                    </select>
                </div>

                {/* Update the second element according to the filter selected */}
                {selectedFilter === 'appointState' ? (
                    <>
                        <div className="w-full">
                            <select
                                className="border p-1 sm:p-3 rounded w-full shadow-sm text-xs sm:text-base"
                                value={filterAppointStateSelectedOption}
                                onChange={handleSelectedState}
                            >
                                <option value="appointState_Created">{viewEnglish ? "Created" : "Δημιουργημένο"}</option>
                                <option value="appointState_Respected">{viewEnglish ? "Respected" : "Τηρημένο"}</option>
                                <option value="appointState_Completed">{viewEnglish ? "Completed" : "Ολοκληρωμένο"}</option>
                                <option value="appointState_Canceled">{viewEnglish ? "Canceled" : "Ακυρωμένο"}</option>
                            </select>
                        </div>
                    </>

                ) : selectedFilter === 'date' ? (
                    <>
                        {/* Starting Date */}
                        <div className="flex items-center sm:border-2 sm:bg-white text-xs sm:text-lg">
                            <span
                                className="material-icons-outlined cursor-pointer text-gray-600 mx-2"
                                onClick={handleStartDateCalendarClick}
                            >
                                edit_calendar
                            </span>
                            {startDate === null ? setStartDate(new Date()) : startDate.getDate() ? startDate.toDateString() : (viewEnglish ? "Select starting date" : "Επιλέξτε αρχική ημερομηνία")}
                        </div>
                        {/* Ending Date */}
                        <div className="flex items-center sm:border-2 sm:bg-white text-xs sm:text-lg">
                            <span
                                className="material-icons-outlined cursor-pointer text-gray-600 sm:mx-2"
                                onClick={handleEndDateCalendarClick}
                            >
                                edit_calendar
                            </span>
                            {endDate === null ? setEndDate(new Date()) : endDate.getDate() ? endDate.toDateString() : (viewEnglish ? "Select ending date" : "Επιλέξτε τελική ημερομηνία")}
                        </div>
                    </>
                ) : (selectedFilter !== "today_appointments" ? (
                    <div className="col-span-1 w-full">
                        <form className="w-full">
                            <div className="">
                                <input
                                    type="text"
                                    onChange={selectedFilter === 'AMKA' ? handleInputAMKAChange : handleInputSurnameChange}
                                    placeholder={selectedFilter === 'AMKA' ? (viewEnglish ? "Enter the AMKA" : "Εισάγετε το AMKA") : (viewEnglish ? "Enter the surname" : "Εισάγετε το επώνυμο")}
                                    className="bg-white  sm:h-10 p-1 sm:px-5 sm:pr-10 rounded-full focus:outline-none w-full text-xs sm:text-base"
                                />
                            </div>
                        </form>
                    </div>
                    ): ""
                )
                }

                {/* Search Button */}
                <div className="flex justify-center w-full">
                    <form className="w-full">
                        <input
                            type={"button"}
                            value={viewEnglish ? "Search" : "Αναζήτηση"}
                            className="bg-blue-500 text-white p-1 sm:px-4 sm:py-2 rounded cursor-pointer hover:bg-blue-700 w-full text-xs sm:text-base"
                            onClick={handleSubmitButtonClick}
                        />
                    </form>
                </div>
            </div>

            {/* Results */}
            <div className="flex flex-auto m-2">

                {/* Map the results */}
                <div className="items-center w-full h-min">

                    <div className={"flex flex-col w-full h-full"}>

                        {
                            appointmentsResolvedList !== null && appointmentsResolvedList.length !== 0 ? paginatedData.map(appointment => (
                                <div
                                    key={appointment.appointmentId}
                                    className={
                                        appointment.appointmentStateId === 1 ? `flex flex-col cursor-pointer w-full p-2 sm:p-4 rounded-xl bg-blue-300 hover:shadow-lg transition-shadow duration-300 mb-4`
                                            : appointment.appointmentStateId === 2 ? `flex flex-col cursor-pointer w-full p-2 sm:p-4 rounded-xl bg-yellow-300 hover:shadow-lg transition-shadow duration-300 mb-4`
                                                : appointment.appointmentStateId === 3 ? `flex flex-col cursor-pointer w-full p-2 sm:p-4 rounded-xl bg-green-300 hover:shadow-lg transition-shadow duration-300 mb-4`
                                                    : appointment.appointmentStateId === 4 ? `flex flex-col cursor-pointer w-full p-2 sm:p-4 rounded-xl bg-red-300 hover:shadow-lg transition-shadow duration-300 mb-4`
                                                        : `flex flex-col cursor-pointer w-full p-2 sm:p-4 rounded-xl bg-purple-300 hover:shadow-lg transition-shadow duration-300 mb-4`
                                    }
                                    onClick={() => handleViewAppointment(appointment.appointmentId)}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            {/* Appointment Code */}
                                            <div className="text-md sm:text-lg font-semibold">
                                                <span className="material-icons-outlined text-gray-600 mx-1 sm:mx-2 align-text-top">fact_check</span>
                                                {"ID: " + appointment.appointmentId}
                                            </div>
                                            {/* AMKA (patient) */}
                                            <div className="text-sm sm:text-md">{"AMKA: " + appointment.appointmentPatientAMKA}</div>
                                            {/* Time */}
                                            <div className="text-xs sm:text-sm text-gray-500">{viewEnglish ? "In" : "Από"} {appointment.appointmentDate}</div>
                                            <div className="text-xs sm:text-sm text-gray-500">{viewEnglish ? "From" : "Έως"} {appointment.appointmentStartTime} to {appointment.appointmentEndTime}</div>
                                            {/* Click to view more info about the appointment */}
                                            <span className="material-icons-outlined text-gray-600 hidden sm:block">more_horiz</span>
                                        </div>
                                        <div className="flex flex-col">
                                            {/* Reason for Appointment */}
                                            <div className="text-md sm:text-lg font-semibold">{viewEnglish ? "Reason for the appointment" : "Λόγος ραντεβού"}</div>
                                            <div className="text-sm sm:text-md">{appointment.appointmentJustification}</div>
                                        </div>
                                    </div>
                                </div>
                            )) : viewEnglish ? "No appointments found" : "Δεν βρέθηκαν ραντεβού"
                        }

                        {/* Pagination Controls */}
                        <div className="flex justify-center mt-4">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handleClick(index + 1)}
                                    className={`px-3 py-1 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calendar Modal */}
                    {showStartDateCalendar && (

                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeOut'}}
                        >
                            <div className="z-10" aria-labelledby="modal-title" role="dialog"
                                 aria-modal="true">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                     aria-hidden="true"></div>

                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div
                                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <div
                                            className="transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <Calendar
                                                    onChange={handleStartDateChange}
                                                    value={startDate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    )}

                    {showEndDateCalendar && (

                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeOut'}}
                        >
                            <div className="z-10" aria-labelledby="modal-title" role="dialog"
                                 aria-modal="true">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                     aria-hidden="true"></div>

                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div
                                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <div
                                            className="transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <Calendar
                                                    onChange={handleEndDateChange}
                                                    value={endDate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    )}
                </div>
            </div>
            {viewDisplayAppointmentComponent && <DisplayInfoAppointment appointment={appointmentToView}/>}
        </div>
    );
}
