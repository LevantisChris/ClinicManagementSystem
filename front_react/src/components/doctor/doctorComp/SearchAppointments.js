import React, {useState} from 'react';
import {motion} from 'framer-motion';
import Calendar from "react-calendar";
import UserService from "../../../services/UserService";


export default function SearchAppointments() {

    /* To keep track of the filter selected */
    const [selectedFilter, setSelectedFilter] = useState('surname');
    /* For the input value */
    const [inputAMKAValue, setInputAMKAValue] = useState('');
    const [inputSurnameValue, setInputSurnameValue] = useState('');

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
        setSelectedFilter(event.target.value);
    };

    const handleSelectedState = (event) => {
        setFilterAppointStateSelectedOption(event.target.value);
        /* NULL to everyone else */
        setStartDate("")
        setEndDate("")
        setInputAMKAValue("")
        setInputSurnameValue("")
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
        setStartDate(formatDateToLocal(newDate));
        handleStartDateCloseCalendar();
        /* NULL to everyone else */
        setFilterAppointStateSelectedOption("")
        setInputAMKAValue("")
        setInputSurnameValue("")
    };

    function handleEndDateCloseCalendar() {
        setShowEndDateCalendar(false);
    }

    const handleEndDateChange = (newDate) => {
        setEndDate(formatDateToLocal(newDate));
        handleEndDateCloseCalendar()
        /* NULL to everyone else */
        setFilterAppointStateSelectedOption("")
        setInputAMKAValue("")
        setInputSurnameValue("")
    };

    const handleInputAMKAChange = (event) => {
        setInputAMKAValue(event.target.value);
        /* NULL to everyone else */
        setFilterAppointStateSelectedOption("")
        setEndDate("")
        setStartDate("")
        setInputSurnameValue("")
    };

    const handleInputSurnameChange = (event) => {
        setInputSurnameValue(event.target.value)
        /* NULL to everyone else */
        setFilterAppointStateSelectedOption("")
        setEndDate("")
        setStartDate("")
        setInputAMKAValue("")
    }

    function formatDateToLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /* Create the JSON request object and send it in the backend  */
    async function handleSubmitButtonClick() {
        const searchCriteria = {
            patientSurname: inputSurnameValue,
            appointmentPatientAMKA: inputAMKAValue,
            appointmentStateId:
                filterAppointStateSelectedOption === "appointState_Canceled" ? 4
                    : filterAppointStateSelectedOption === "appointState_Created" ? 1
                        : filterAppointStateSelectedOption === "appointState_Respected" ? 2
                            : filterAppointStateSelectedOption === "appointState_Completed" ? 3
                                : "",
            startDate: startDate,
            endDate: endDate
        };
        console.log("JSON: ", searchCriteria)

        const response = await UserService.searchAppointment(searchCriteria)
        console.log("TESTTT: ", response)
        if (response.statusCode === 200) {
            //setLoading(false)
        } else {
            //setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-min border">
            <div className={`grid ${selectedFilter === 'date' ? 'grid-cols-4' : 'grid-cols-3'} p-4 gap-4 h-min`}>
                {/* Choice Box */}
                <div className="w-full">
                    <select
                        className="border p-2 rounded w-full shadow-sm"
                        value={selectedFilter}
                        onChange={handleSelectedFilter}
                    >
                        <option value="surname">By Surname</option>
                        <option value="AMKA">By AMKA</option>
                        <option value="appointState">By Appoin. state</option>
                        <option value="date">By Date</option>
                    </select>
                </div>

                {/* Update the second element according to the filter selected */}
                {selectedFilter === 'appointState' ? (
                    <>
                        <div className="w-full">
                            <select
                                className="border p-2 rounded w-full shadow-sm"
                                value={filterAppointStateSelectedOption}
                                onChange={handleSelectedState}
                            >
                                <option value="appointState_Created">Created</option>
                                <option value="appointState_Respected">Respected</option>
                                <option value="appointState_Completed">Completed</option>
                                <option value="appointState_Canceled">Canceled</option>
                            </select>
                        </div>
                    </>
                ) : selectedFilter === 'date' ? (
                    <>
                        {/* Starting Date */}
                        <div className="flex items-center border-2 bg-white">
                            <span
                                className="material-icons-outlined cursor-pointer text-gray-600 mx-2"
                                onClick={handleStartDateCalendarClick}
                            >
                                edit_calendar
                            </span>
                            { startDate.getDate() ? startDate.toDateString() : "Select starting date"}
                        </div>
                        {/* Ending Date */}
                        <div className="flex items-center border-2 bg-white">
                            <span
                                className="material-icons-outlined cursor-pointer text-gray-600 mx-2"
                                onClick={handleEndDateCalendarClick}
                            >
                                edit_calendar
                            </span>
                            { endDate.getDate() ? endDate.toDateString() : "Select end date"}
                        </div>
                    </>
                ) : (
                    <div className="col-span-1 w-full">
                        <form className="w-full">
                        <div className="relative">
                                <input
                                    type="text"
                                    onChange={ selectedFilter === 'AMKA' ? handleInputAMKAChange : handleInputSurnameChange }
                                    placeholder={selectedFilter === 'AMKA' ? "Enter the AMKA" : "Enter the surname"}
                                    className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full"
                                />
                            </div>
                        </form>
                    </div>

                )
                }

                {/* Search Button */}
                <div className="flex justify-center w-full">
                    <form className="w-full">
                        <input
                            type={"button"}
                            value="Search"
                            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 w-full"
                            onClick={handleSubmitButtonClick}
                        />
                    </form>
                </div>
            </div>

            {/* Results */}
            <div className="flex flex-auto m-2">

                {/* This is an example of a result */}
                <div className="items-center w-full h-min">

                    <div
                        className="flex flex-col w-full h-full border p-4 rounded-2xl bg-green-400 hover:shadow-lg transition-shadow duration-300  mb-4">
                        <div className="grid grid-cols-2 w-full h-full">
                            <div className="flex flex-col justify-start">
                                {/* Code */}
                                <div className="text-lg font-semibold">QPSK12354687898465142132</div>
                                {/* Name (patient) */}
                                <div className="text-md">Christos Christakis</div>
                                {/* Time */}
                                <div className="text-sm text-gray-500">Tuesday 12 August, 12 AM - 5 PM</div>
                            </div>
                            <div className="flex flex-col justify-start">
                                {/* Code */}
                                <div className="text-lg font-semibold">Reason for the appointment</div>
                                <div className="text-md">
                                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* This is an example of a result */}
                    <div className="items-center w-full h-min">
                        <div
                            className="flex flex-col w-full h-full border p-4 rounded-2xl bg-red-500 hover:shadow-lg transition-shadow duration-300 mb-4">
                            <div className="grid grid-cols-2 w-full h-full">
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">QPSK12354687898465142132</div>
                                    {/* Name (patient) */}
                                    <div className="text-md">Christos Christakis</div>
                                    {/* Time */}
                                    <div className="text-sm text-gray-500">Tuesday 12 August, 12 AM - 5 PM</div>
                                </div>
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">Reason for the appointment</div>
                                    <div className="text-md">
                                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* This is an example of a result */}
                    <div className="items-center w-full h-min">
                        <div
                            className="flex flex-col w-full h-full border p-4 rounded-2xl bg-red-500 hover:shadow-lg transition-shadow duration-300 mb-4">
                            <div className="grid grid-cols-2 w-full h-full">
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">QPSK12354687898465142132</div>
                                    {/* Name (patient) */}
                                    <div className="text-md">Christos Christakis</div>
                                    {/* Time */}
                                    <div className="text-sm text-gray-500">Tuesday 12 August, 12 AM - 5 PM</div>
                                </div>
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">Reason for the appointment</div>
                                    <div className="text-md">
                                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* This is an example of a result */}
                    <div className="items-center w-full h-min">
                        <div
                            className="flex flex-col w-full h-full border p-4 rounded-2xl bg-red-500 hover:shadow-lg transition-shadow duration-300 mb-4">
                            <div className="grid grid-cols-2 w-full h-full">
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">QPSK12354687898465142132</div>
                                    {/* Name (patient) */}
                                    <div className="text-md">Christos Christakis</div>
                                    {/* Time */}
                                    <div className="text-sm text-gray-500">Tuesday 12 August, 12 AM - 5 PM</div>
                                </div>
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">Reason for the appointment</div>
                                    <div className="text-md">
                                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* This is an example of a result */}
                    <div className="items-center w-full h-min">
                        <div
                            className="flex flex-col w-full h-full border p-4 rounded-2xl bg-red-500 hover:shadow-lg transition-shadow duration-300 mb-4">
                            <div className="grid grid-cols-2 w-full h-full">
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">QPSK12354687898465142132</div>
                                    {/* Name (patient) */}
                                    <div className="text-md">Christos Christakis</div>
                                    {/* Time */}
                                    <div className="text-sm text-gray-500">Tuesday 12 August, 12 AM - 5 PM</div>
                                </div>
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">Reason for the appointment</div>
                                    <div className="text-md">
                                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* This is an example of a result */}
                    <div className="items-center w-full h-min">
                        <div
                            className="flex flex-col w-full h-full border p-4 rounded-2xl bg-red-500 hover:shadow-lg transition-shadow duration-300 mb-4">
                            <div className="grid grid-cols-2 w-full h-full">
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">QPSK12354687898465142132</div>
                                    {/* Name (patient) */}
                                    <div className="text-md">Christos Christakis</div>
                                    {/* Time */}
                                    <div className="text-sm text-gray-500">Tuesday 12 August, 12 AM - 5 PM</div>
                                </div>
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">Reason for the appointment</div>
                                    <div className="text-md">
                                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* This is an example of a result */}
                    <div className="items-center w-full h-min">
                        <div
                            className="flex flex-col w-full h-full border p-4 rounded-2xl bg-red-500 hover:shadow-lg transition-shadow duration-300 mb-4">
                            <div className="grid grid-cols-2 w-full h-full">
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">QPSK12354687898465142132</div>
                                    {/* Name (patient) */}
                                    <div className="text-md">Christos Christakis</div>
                                    {/* Time */}
                                    <div className="text-sm text-gray-500">Tuesday 12 August, 12 AM - 5 PM</div>
                                </div>
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-lg font-semibold">Reason for the appointment</div>
                                    <div className="text-md">
                                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Modal */}
                    {showStartDateCalendar && (

                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeOut'}}
                        >
                            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                     aria-hidden="true"></div>

                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div
                                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <div
                                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                     aria-hidden="true"></div>

                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div
                                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <div
                                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
        </div>
    );
}
