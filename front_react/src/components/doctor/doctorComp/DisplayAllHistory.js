import {React, useContext, useEffect, useState} from "react"
import SearchPatients from "./SearchPatients";
import GlobalContext from "../../../context/GlobalContext";
import {Alert, Button, Input} from "@material-tailwind/react";
import {motion} from 'framer-motion';
import Datepicker from "react-tailwindcss-datepicker";
import UserService from "../../../services/UserService";

export function DisplayAllHistory() {

    const {
        patientHistoryToSee,
        setPatientHistoryToSee
    } = useContext(GlobalContext);

    const [registrationToSee, setRegistrationToSee] = useState(null)

    /* For the date picker in the filter */
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    /* For the detected health problem filter */
    const [detectedHealthProblemFilter, setDetectedHealthProblemFilter] = useState("")
    /* To keep the results after the filter function */
    const [filteredResults, setFilteredResults] = useState(null);
    /* To know when to show the clear filters/results button */
    const [showClearButton, setShowClearButton] = useState(false)

    useEffect(() => {
        setDetectedHealthProblemFilter("")
        setValue(null)
        setFilteredResults(null)
        setShowClearButton(false)
    }, [patientHistoryToSee]);

    function handleFilterDetectedHealthProblem(event) {
        setDetectedHealthProblemFilter(event.target.value)
    }

    async function handleFilterSubmit() {
        setShowClearButton(true)
        const params = {
            healthProblemCriteria: detectedHealthProblemFilter,
            startDate: value !== null ? formatDateToLocal(value.startDate) : "",
            endDate: value !== null ? formatDateToLocal(value.endDate) : "",
            patientID: patientHistoryToSee.patientId
        }
        console.log("TET: ", params)
        const response = await UserService.searchRegistrations(params);
        console.log(response)
        setFilteredResults(response)
    }

    function formatDateToLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function handleClearFilters() {
        setDetectedHealthProblemFilter("")
        setValue(null)
        setFilteredResults(null)
        setShowClearButton(false)
    }

    return (
        <div className={"w-full p-2"}>
            {
                /* If the patientHistoryToSee is null, that means the user doesn't have any patient selected to view the history. */
                patientHistoryToSee === null ?
                    <SearchPatients bigTitle={"Display all the history of a patient"}
                                    smallTitle={"Choose a patient and then the registration you want to view"}
                                    componentState={2}
                    />
                    :
                    patientHistoryToSee.statusCode === 200 ?
                        <div className={"p-2 rounded shadow-5xl"}>
                            <p className="font-light text-5xl">
                                Display all the history of a patient
                            </p>
                            <p className="mt-2 font-light text-slate-400">
                                Choose a patient and then the registration you want to view
                            </p>
                            <header
                                className="rounded bg-blue-200 px-4 py-2 flex justify-between items-center mt-3 shadow-lg">
                                <div
                                    className={"flex flex-col text-center bg-blue-200 p-4 hover:bg-blue-300 transition ease-in rounded cursor-default shadow-lg"}>
                                    <span
                                        className="material-icons-outlined text-gray-600 mx-2 align-text-top text-4xl"
                                    >
                                        person_search
                                    </span>
                                    <p className="text-2xl text-black font-black hover:text-sky-700">
                                        {patientHistoryToSee.patientHistoryRegistrations[0].appointment.appointmentPatient.user.user_name} {patientHistoryToSee.patientHistoryRegistrations[0].appointment.appointmentPatient.user.user_surname} History
                                    </p>
                                </div>
                                <div>
                                    <Button className={"text-xl text-white bg-blue-500"}
                                            onClick={() => setPatientHistoryToSee(null)}>
                                        Go Back
                                    </Button>
                                </div>
                            </header>

                            {/* Add the filters, by date and by health problem detected */}
                            {/* Calendar Picker Component from https://github.com/onesine/react-tailwindcss-datepicker?tab=readme-ov-file */}
                            <div  className={
                                showClearButton
                                    ? "grid grid-rows-2 gap-2 bg-slate-200 rounded-xl border-4 p-2"
                                    : "grid grid-rows-1 gap-2 bg-slate-200 rounded-xl border-4 p-2"
                            }>
                                <div className={"grid grid-cols-4 gap-2"}>
                                    <div className="flex col-span-1 w-full items-center">
                                            <span className="material-icons-outlined text-gray-600 mx-2">
                                              filter_list
                                            </span>
                                        <Button className="bg-green-500 w-full" onClick={handleFilterSubmit}>
                                            Apply
                                            filters
                                        </Button>
                                    </div>
                                    <Datepicker
                                        primaryColor="blue"
                                        showShortcuts={true}
                                        value={value}
                                        onChange={newValue => setValue(newValue)}
                                    />
                                    <input
                                        className="rounded-lg col-span-2"
                                        placeholder="Detected health problem"
                                        value={detectedHealthProblemFilter}
                                        onChange={(event) => handleFilterDetectedHealthProblem(event)}
                                    />
                                </div>

                                {
                                    showClearButton ?
                                        <Button className="bg-red-500 w-full" onClick={handleClearFilters}>
                                            Clear filters
                                        </Button> : ""
                                }
                            </div>

                            <div
                                className="flex-grow overflow-x-auto mt-2 rounded-xl border-4 p-5 gap-6 grid grid-cols-1 mb-5 shadow-xl">
                                {
                                    filteredResults === null
                                    ?
                                        patientHistoryToSee.patientHistoryRegistrations.map((registration) => (
                                        <div
                                            key={registration.patientHistoryRegistrationId}
                                            className="flex flex-col cursor-pointer w-full h-full p-4 rounded-2xl bg-blue-200 hover:shadow-lg transition-shadow duration-300 mb-4"
                                            onClick={() => setRegistrationToSee(registration)}
                                        >
                                            <div className="grid grid-cols-3 w-max h-full">
                                                <div className="flex flex-col justify-start">
                                                    <div className="text-lg font-semibold">
                                                        <span className="material-icons-outlined text-gray-600 mx-2 align-text-top">
                                                          fact_check
                                                        </span>
                                                        {"ID: " + registration.patientHistoryRegistrationId}
                                                    </div>
                                                    <div className="text-md">
                                                        Health problem:{" "}
                                                        {registration.patientHistoryRegistrationHealthProblems}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Suggested Treatment:{" "}
                                                        {registration.patientHistoryRegistrationTreatment}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Doctor:{" "}
                                                        {registration.appointment.appointmentDoctor.user.user_name}{" "}
                                                        {registration.appointment.appointmentDoctor.user.user_surname}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Relative appointment date:{" "}
                                                        {registration.appointment.appointmentDate}
                                                    </div>
                                                    <span className="material-icons-outlined text-gray-600">
                                                        more_horiz
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : (filteredResults.statusCode === 200
                                        ? filteredResults.patientHistoryRegistrations.map((registration) => (
                                            <div
                                                key={registration.patientHistoryRegistrationId}
                                                className="flex flex-col cursor-pointer w-full h-full p-4 rounded-2xl bg-blue-200 hover:shadow-lg transition-shadow duration-300 mb-4"
                                                onClick={() => setRegistrationToSee(registration)}
                                            >
                                                <div className="grid grid-cols-3 w-max h-full">
                                                    <div className="flex flex-col justify-start">
                                                        <div className="text-lg font-semibold">
                                                            <span className="material-icons-outlined text-gray-600 mx-2 align-text-top">
                                                              fact_check
                                                            </span>
                                                            {"ID: " + registration.patientHistoryRegistrationId}
                                                        </div>
                                                        <div className="text-md">
                                                            Health problem:{" "}
                                                            {registration.patientHistoryRegistrationHealthProblems}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Suggested Treatment:{" "}
                                                            {registration.patientHistoryRegistrationTreatment}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Doctor:{" "}
                                                            {registration.appointment.appointmentDoctor.user.user_name}{" "}
                                                            {registration.appointment.appointmentDoctor.user.user_surname}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Relative appointment date:{" "}
                                                            {registration.appointment.appointmentDate}
                                                        </div>
                                                        <span className="material-icons-outlined text-gray-600">
                                                            more_horiz
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : filteredResults.statusCode === 500 ? (
                                                <div
                                                    className="flex-grow mt-2 rounded-xl bg-slate-200 border-4 p-5 flex justify-center items-center">
                                                    <div className="text-center">
                                                        <span className="material-icons-outlined text-9xl text-red-600">
                                                            trending_down
                                                        </span>
                                                        <p className="text-xl text-red-600">
                                                            Cannot find results, check your filters
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : null
                                        )
                                }
                            </div>


                        </div>
                        : /* Not any History was found */
                        <div className={"p-2 rounded shadow-5xl"}>
                            <p className="font-light text-5xl">
                                Display all the history of a patient
                            </p>
                            <p className="mt-2 font-light text-slate-400">
                                Choose a patient and then the registration you want to view
                            </p>
                            <header className="rounded bg-slate-200 px-4 py-2 flex justify-between items-center mt-3">
                                <p className="text-2xl text-red-600 font-black hover:text-red-700">
                                    Error, not history found
                                </p>
                                <div>
                                    <Button className={"text-xl text-white bg-blue-500"}
                                            onClick={() => setPatientHistoryToSee(null)}>
                                        Go Back
                                    </Button>
                                </div>
                            </header>

                            <div
                                className="flex-grow mt-2 rounded-xl bg-slate-200 border-4 p-5 flex justify-center items-center">
                                <div className="text-center">
                                    <span className="material-icons-outlined text-9xl text-red-600">
                                        trending_down
                                    </span>
                                    <p className="text-xl text-red-600">
                                        Cannot find patient history, create a new registration and the history of the
                                        patient will automatically created.
                                    </p>
                                </div>
                            </div>
                        </div>
            }
            {registrationToSee !== null ?
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.1, ease: 'easeOut'}}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <div
                        className="flex flex-col justify-between p-5 bg-white rounded-lg cursor-default shadow-2xl w-5/12 max-w-full h-5/6 overflow-auto"
                    >
                        <header className="rounded bg-slate-200 px-4 py-2 flex justify-between items-center">
                            <p className="text-2xl text-black font-black hover:text-sky-700">
                                Registration with ID: {registrationToSee.patientHistoryRegistrationId}
                            </p>
                            <div>
                                <button onClick={() => setRegistrationToSee(null)}>
                                    <span
                                        className="material-icons-outlined text-black-400 hover:bg-red-400 rounded-xl transition duration-500 ease-in-out"
                                    >
                                        close
                                    </span>
                                </button>
                            </div>
                        </header>

                        <div
                            className="flex-grow overflow-x-auto mt-2 rounded-xl border-4 p-5 gap-6 grid grid-cols-1 mb-5 shadow-xl">
                            <div className="bg-blue-200 p-2 rounded-xl">
                                <p className="text-black text-2xl font-bold hover:text-sky-700">
                                    Registration Information
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Registration ID: {registrationToSee.patientHistoryRegistrationId}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Date Register: {registrationToSee.patientHistoryRegistrationDateRegister}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Detected Health
                                    Problem: {registrationToSee.patientHistoryRegistrationHealthProblems}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Suggested Treatment: {registrationToSee.patientHistoryRegistrationTreatment}
                                </p>
                            </div>

                            <div className="bg-slate-200 p-2 rounded-xl">
                                <p className="text-black text-2xl font-bold hover:text-sky-700">
                                    Relative Appointment Information
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Appointment ID: {registrationToSee.appointment.appointmentId}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Start Time: {registrationToSee.appointment.appointmentStartTime}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    End Time: {registrationToSee.appointment.appointmentEndTime}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Justification: {registrationToSee.appointment.appointmentJustification}
                                </p>
                            </div>

                            <div className="bg-slate-200 p-2 rounded-xl">
                                <p className="text-black text-2xl font-bold hover:text-sky-700">
                                    Patient Information
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Appointment ID: {registrationToSee.appointment.appointmentPatient.patient_id}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    First-Name: {registrationToSee.appointment.appointmentPatient.user.user_name}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Second-Name: {registrationToSee.appointment.appointmentPatient.user.user_surname}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    ID-Number: {registrationToSee.appointment.appointmentPatient.user.user_idNumber}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Email: {registrationToSee.appointment.appointmentPatient.user.email}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    AMKA: {registrationToSee.appointment.appointmentPatient.patient_AMKA}
                                </p>
                            </div>

                            <div className="bg-slate-200 p-2 rounded-xl">
                                <p className="text-black text-2xl font-bold hover:text-sky-700">
                                    Doctor Information
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Doctor ID: {registrationToSee.appointment.appointmentDoctor.doctor_id}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    First-Name: {registrationToSee.appointment.appointmentDoctor.user.user_name}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Second-Name: {registrationToSee.appointment.appointmentDoctor.user.user_surname}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Email: {registrationToSee.appointment.appointmentDoctor.user.email}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Speciality: {registrationToSee.appointment.appointmentDoctor.doctorSpeciality.specialityDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                    : null
                    }
                </div>
                );
            }