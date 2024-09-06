import {React, useContext, useEffect, useState} from "react"
import SearchPatients from "./SearchPatients";
import GlobalContext from "../../../context/GlobalContext";
import {Alert, Button, Input} from "@material-tailwind/react";
import {motion} from 'framer-motion';
import Datepicker from "react-tailwindcss-datepicker";
import UserService from "../../../services/UserService";
import GeneratePDF from "../../../services/GeneratePDF";

export function DisplayAllHistory() {

    const {
        patientHistoryToSee,
        setPatientHistoryToSee,
        viewEnglish
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
        const response = await UserService.searchRegistrations(params);
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

    /* pagination settings */

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    const totalItems = (filteredResults === null && patientHistoryToSee !== null && patientHistoryToSee.patientHistoryRegistrations !== undefined)
        ? patientHistoryToSee.patientHistoryRegistrations.length
        : (filteredResults !== null && filteredResults.statusCode === 200)
            ? filteredResults.patientHistoryRegistrations.length
            : 0;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const paginatedData = (filteredResults === null && patientHistoryToSee !== null && patientHistoryToSee.patientHistoryRegistrations !== undefined)
        ? getPaginatedData(patientHistoryToSee.patientHistoryRegistrations)
        : (filteredResults !== null && filteredResults.statusCode === 200)
            ? getPaginatedData(filteredResults.patientHistoryRegistrations)
            : [];

    /*-------------------------------------------------------------*/


    return (
        <div className={"w-full p-2"}>
            {
                /* If the patientHistoryToSee is null, that means the user doesn't have any patient selected to view the history. */
                patientHistoryToSee === null ?
                    <SearchPatients bigTitle={viewEnglish ? "Display all the history of a patient" : "Εμφάνιση όλου του ιστορικού ενός ασθενούς"}
                                    smallTitle={viewEnglish ? "Choose a patient and then the registration you want to view" : "Επιλέξτε έναν ασθενή και στη συνέχεια την εγγραφή που θέλετε να δείτε."}
                                    componentState={2}
                    />
                    :
                    patientHistoryToSee.statusCode === 200 ?
                        <div className={"p-2 rounded shadow-5xl"}>
                            <p className="font-light text-xl sm:text-5xl">
                                {viewEnglish ? "Display all the history of a patient" : "Εμφάνιση όλου του ιστορικού ενός ασθενούς"}
                            </p>
                            <p className="mt-2 font-light text-slate-400">
                                {viewEnglish ? "Choose a patient and then the registration you want to view" : "Επιλέξτε έναν ασθενή και στη συνέχεια την εγγραφή που θέλετε να δείτε."}
                            </p>
                            <header
                                className="rounded bg-blue-200 px-4 py-2 flex justify-between items-center mt-3 shadow-lg">
                                <div
                                    className={"flex flex-col text-center bg-blue-200 p-4 hover:bg-blue-300 transition ease-in rounded cursor-default shadow-lg"}>
                                    <span
                                        className="material-icons-outlined text-gray-600 mx-2 align-text-top text-2xl sm:text-4xl"
                                    >
                                        person_search
                                    </span>
                                    <p className="text-sm sm:text-2xl text-black font-black hover:text-sky-700">
                                        {patientHistoryToSee.patientHistoryRegistrations[0].appointment.appointmentPatient.user.user_name} {patientHistoryToSee.patientHistoryRegistrations[0].appointment.appointmentPatient.user.user_surname} {viewEnglish ? "History" : "Ιστορικό"}
                                    </p>
                                    <Button
                                        className={"text-xs mt-2 text-white bg-blue-500"}
                                        onClick={() => GeneratePDF.createPDF(
                                            patientHistoryToSee.patientHistoryRegistrations[0].appointment.appointmentPatient.user.user_name + " " +patientHistoryToSee.patientHistoryRegistrations[0].appointment.appointmentPatient.user.user_surname,
                                            patientHistoryToSee.patientHistoryRegistrations
                                        )
                                    }
                                    >
                                        {viewEnglish ? "Generate PDF" : "Δημιουργία PDF"}
                                    </Button>
                                </div>
                                <div>
                                    <Button className={"text-xs ml-2 sm:text-xl text-white bg-blue-500"}
                                            onClick={() => setPatientHistoryToSee(null)}>
                                        {viewEnglish ? "Go Back" : "Επιστροφη"}
                                    </Button>
                                </div>
                            </header>

                            {/* Add the filters, by date and by health problem detected */}
                            {/* Calendar Picker Component from https://github.com/onesine/react-tailwindcss-datepicker?tab=readme-ov-file */}
                            <div
                                className={
                                showClearButton
                                    ? "grid grid-rows-2 gap-2 bg-slate-200 rounded-xl border-4 p-2"
                                    : "grid grid-rows-1 gap-2 bg-slate-200 rounded-xl border-4 p-2"
                                }
                            >
                                <div className={"flex flex-col sm:grid sm:grid-cols-4 gap-2"}>
                                    <div className="flex col-span-1 w-full items-center">
                                            <span className="material-icons-outlined text-gray-600 mx-2">
                                              filter_list
                                            </span>
                                        <Button className="bg-green-500 w-full" onClick={handleFilterSubmit}>
                                            {viewEnglish ? "Apply filters" : "Εφαρμόστε φίλτρα"}
                                        </Button>
                                    </div>
                                    <div className={"z-0"}>
                                        <Datepicker
                                            primaryColor="blue"
                                            showShortcuts={true}
                                            value={value}
                                            onChange={newValue => setValue(newValue)}
                                        />
                                    </div>
                                    <input
                                        className="rounded-lg col-span-2"
                                        placeholder={viewEnglish ? "Detected health problem" : "Εντοπισμένο πρόβλημα υγείας"}
                                        value={detectedHealthProblemFilter}
                                        onChange={(event) => handleFilterDetectedHealthProblem(event)}
                                    />
                                </div>

                                {
                                    showClearButton ?
                                        <Button className="bg-red-500 w-full h-1/2 sm:h-full" onClick={handleClearFilters}>
                                            {viewEnglish ? "Clear filters" : "Εκκαθάριση φίλτρων"}
                                        </Button> : ""
                                }
                            </div>

                            <div
                                className="flex-grow mt-2 rounded-xl border-4 p-5 gap-6 grid grid-cols-1 mb-5 shadow-xl">
                                {
                                    filteredResults === null
                                    ?
                                        paginatedData.map((registration) => (
                                            <div
                                                key={registration.patientHistoryRegistrationId}
                                                className="flex flex-col cursor-pointer w-full h-full p-3 sm:p-4 rounded-2xl bg-blue-200 hover:shadow-lg transition-shadow duration-300 mb-4"
                                                onClick={() => setRegistrationToSee(registration)}
                                            >
                                                <div
                                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full h-full">
                                                    <div className="flex flex-col justify-start">
                                                        <div className="text-lg font-semibold">
                                                            <span className="material-icons-outlined text-gray-600 mx-2 align-text-top">
                                                              fact_check
                                                            </span>
                                                            {"ID: " + registration.patientHistoryRegistrationId}
                                                        </div>
                                                        <div className="text-md">
                                                            {viewEnglish ? "Health problem:" : "Πρόβλημα υγείας:"} {registration.patientHistoryRegistrationHealthProblems}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {viewEnglish ? "Suggested Treatment:" : "Προτεινόμενη θεραπεία:"} {registration.patientHistoryRegistrationTreatment}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {viewEnglish ? "Doctor:" : "Γιατρός:"} {registration.appointment.appointmentDoctor.user.user_name}{" "}
                                                            {registration.appointment.appointmentDoctor.user.user_surname}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {viewEnglish ? "Relative appointment date:" : "Ημερομηνία σχετικού ραντεβού:"} {registration.appointment.appointmentDate}
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
                                                            <span
                                                                className="material-icons-outlined text-gray-600 mx-2 align-text-top">
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


                        </div>
                        : /* Not any History was found */
                        <div className={"p-2 rounded shadow-5xl"}>
                            <p className="font-light text-3xl sm:text-5xl">
                                Display all the history of a patient
                            </p>
                            <p className="mt-2 text-xs sm:text-base font-light text-slate-400">
                                Choose a patient and then the registration you want to view
                            </p>
                            <header className="rounded bg-slate-200 px-4 py-2 flex justify-between items-center mt-3">
                                <p className="text-sm sm:text-2xl text-red-600 font-black hover:text-red-700">
                                    {viewEnglish ? "Error, not history found" : "Σφάλμα, δεν βρέθηκε ιστορικό"}
                                </p>
                                <div>
                                    <Button className={"text-xs sm:text-xl text-white bg-blue-500"}
                                            onClick={() => setPatientHistoryToSee(null)}>
                                        {viewEnglish ? "Go Back" : "Επιστροφη"}
                                    </Button>
                                </div>
                            </header>

                            <div
                                className="flex-grow mt-2 rounded-xl bg-slate-200 border-4 p-5 flex justify-center items-center">
                                <div className="text-center">
                                    <span className="material-icons-outlined text-5xl sm:text-9xl text-red-600">
                                        trending_down
                                    </span>
                                    <p className="text=sm sm:text-xl text-red-600">
                                        {viewEnglish ? "Cannot find patient history, create a new registration and the history of the patient will automatically created." : "Δεν μπορείτε να βρείτε το ιστορικό του ασθενούς, δημιουργήστε μια νέα εγγραφή και το ιστορικό του ασθενούς θα δημιουργηθεί αυτόματα."}
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
                        className="flex flex-col justify-between p-4 sm:p-5 bg-white rounded-lg cursor-default shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 max-w-full h-5/6 overflow-auto"
                    >
                        <header className="rounded bg-slate-200 px-4 py-2 flex justify-between items-center">
                            <p className="text-xl sm:text-2xl text-black font-black hover:text-sky-700">
                                {viewEnglish ? "Registration with ID:" : "Εγγραφή με ID:"} {registrationToSee.patientHistoryRegistrationId}
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

                        <Button
                            className="text-xs mt-2 text-white bg-blue-500"
                            onClick={() =>
                                GeneratePDF.createPDF(
                                    registrationToSee.appointment.appointmentPatient.user.user_name +
                                    ' ' +
                                    registrationToSee.appointment.appointmentPatient.user.user_surname,
                                    registrationToSee
                                )
                            }
                        >
                            {viewEnglish ? "Generate PDF" : "Δημιουργια PDF"}
                        </Button>

                        <div
                            className="flex-grow overflow-x-auto mt-2 rounded-xl border-4 p-5 gap-6 grid grid-cols-1 sm:grid-cols-1 mb-5 shadow-xl"
                        >
                            <div className="bg-blue-200 p-2 rounded-xl">
                                <p className="text-black text-xl sm:text-2xl font-bold hover:text-sky-700">
                                    {viewEnglish ? "Registration Information" : "Πληροφορίες Εγγραφής"}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Registration ID:" : "ID εγγραφής:"} {registrationToSee.patientHistoryRegistrationId}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Date Register:" : "Ημερομηνία Καταχώρησης:"} {registrationToSee.patientHistoryRegistrationDateRegister}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Detected Health Problem:" : "Πρόβλημα Υγείας:"} {registrationToSee.patientHistoryRegistrationHealthProblems}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Suggested Treatment:" : "Προτεινόμενη Θεραπεία:"} {registrationToSee.patientHistoryRegistrationTreatment}
                                </p>
                            </div>

                            <div className="bg-slate-200 p-2 rounded-xl">
                                <p className="text-black text-xl sm:text-2xl font-bold hover:text-sky-700">
                                    {viewEnglish ? "Relative Appointment Information" : "Πληροφορίες Σχετικού Ραντεβού"}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Appointment ID:" : "ID Ραντεβού:"} {registrationToSee.appointment.appointmentId}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Start Time:" : "Ώρα έναρξης:"} {registrationToSee.appointment.appointmentStartTime}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "End Time:" : "Ώρα Λήξης:"} {registrationToSee.appointment.appointmentEndTime}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Justification:" : "Λόγος Ραντεβού:"} {registrationToSee.appointment.appointmentJustification}
                                </p>
                            </div>

                            <div className="bg-slate-200 p-2 rounded-xl">
                                <p className="text-black text-xl sm:text-2xl font-bold hover:text-sky-700">
                                    {viewEnglish ? "Patient Information" : "Πληροφορίες Ασθενή"}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Appointment ID:" : "ID Ραντεβού:"} {registrationToSee.appointment.appointmentPatient.patient_id}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "First - Name:" : "Όνομα:"} {registrationToSee.appointment.appointmentPatient.user.user_name}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Second - Name:" : "Επώνυμο:"} {registrationToSee.appointment.appointmentPatient.user.user_surname}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "ID - Number:" : "Αριθμός Ταυτότητας:"} {registrationToSee.appointment.appointmentPatient.user.user_idNumber}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    Email: {registrationToSee.appointment.appointmentPatient.user.email}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    AMKA: {registrationToSee.appointment.appointmentPatient.patient_AMKA}
                                </p>
                            </div>

                            <div className="bg-slate-200 p-2 rounded-xl">
                                <p className="text-black text-xl sm:text-2xl font-bold hover:text-sky-700">
                                    {viewEnglish ? "Doctor Information" : "Πληροφορίες Γιατρού"}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Doctor ID:" : "ID Γιατρού:"} {registrationToSee.appointment.appointmentDoctor.doctor_id}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "First - Name:" : "Όνομα:"} {registrationToSee.appointment.appointmentDoctor.user.user_name}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Second - Name:" : "Επώνυμο:"} {registrationToSee.appointment.appointmentDoctor.user.user_surname}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    Email: {registrationToSee.appointment.appointmentDoctor.user.email}
                                </p>
                                <p className="text-black text-base sm:text-lg font-light hover:text-sky-700">
                                    {viewEnglish ? "Speciality:" : "Ειδικότητα:"} {registrationToSee.appointment.appointmentDoctor.doctorSpeciality.specialityDescription}
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