import React, {useContext, useState} from 'react'
import UserService from "../../../services/UserService";
import {Alert} from "@material-tailwind/react";
import GlobalContext from "../../../context/GlobalContext";

export default function CreateHistoryReg() {

    const {
        viewEnglish
    } = useContext(GlobalContext)

    const [apppointList, setAppointList] = useState([]);
    const [selectedAppoint, setSelectedAppoint] = useState("")
    const [showAppointments, setShowAppointments] = useState(false)

    /* To keep track of the text entered the text fields */
    const [healthProblem, setHealthProblem] = useState("")
    const [suggestedTreatment, setSuggestedTreatment] = useState("")

    /* To show the alert */
    const [showAlert, setShowAlert] = useState("")

    const selectAppointment = async (event) => {
        event.preventDefault();

        setShowAlert("")

        if(showAppointments === true) {
            setAppointList([])
            setShowAppointments(false)
        }

        if(showAppointments === false && selectedAppoint === "") {
            const appointmentsList = await UserService.getCreateAndRespectedAppointments();
            if (appointmentsList.length !== 0) {
                console.log(appointmentsList);
                setAppointList(appointmentsList)
                setShowAppointments(true)
            } else {
                console.log("The appointments List is empty");
            }
        }
    };


    function handleAppointClick(appointment) {
        setSelectedAppoint(appointment)
        setShowAppointments(false)
    }

    function handleClearClick() {
        setSelectedAppoint("")
        setShowAppointments(false)
        setAppointList([])
    }

    /* Here sed the request to create the registration */
    async function handleSubmitButton(event) {
        event.preventDefault()
        if (healthProblem === "" || suggestedTreatment === "" || selectedAppoint === "") {
            setShowAlert("Please fill out all the info about the registration.")
        } else {
            const data = {
                patientHistoryRegistrationAppointmentId: selectedAppoint.appointmentId,
                patientHistoryRegistrationHealthProblems: healthProblem,
                patientHistoryRegistrationTreatment: suggestedTreatment
            }
            console.log(data)
            const response = await UserService.createPatientHistoryRegistration(data);
            console.log(response)
            if(response.statusCode === 200) {
                setShowAlert("The creation has been done successfully")
                setSelectedAppoint("")
                setAppointList([])
                setSuggestedTreatment("")
                setHealthProblem("")
                setShowAppointments(false)
            }
        }
    }

    function handleSuggestedTreatmentChange(event) {
        setShowAlert("")
        setSuggestedTreatment(event.target.value)
    }

    function handleDetectedHealthProblemsChange(event) {
        setShowAlert("")
        setHealthProblem(event.target.value)
    }

    return(
        <div className="flex flex-col max-h-screen sm:overflow-y-auto h-min w-full p-4 sm:p-10 cursor-default">
            <p className={"font-light text-3xl sm:text-5xl"}>
                {viewEnglish ? "Create a History Registration" : "Δημιουργία Εγγραφής Ιστορικού"}
            </p>
            <p className={"mt-2 text-sm sm:text-lg font-light text-slate-400"}>
                {viewEnglish ? "Insert the information about the problem and treatment you suggest" : "Εισάγετε τις πληροφορίες σχετικά με το πρόβλημα και τη θεραπεία που προτείνετε"}
            </p>

            {/* Form to register the user */}
            <form className="w-full h-full mt-5 justify-items-start">
                <div className="z-0 w-full mb-5 group flex items-center bg-slate-300 rounded-xl p-2">
                    <span className="hidden sm:block material-icons-outlined text-blue-600 mr-3 text-4xl">
                        star_half
                    </span>
                    <button className={
                        apppointList.length === 0
                            ? "text-sm p-3 rounded bg-slate-300 to-transparent hover:bg-slate-400 transition ease-linear mr-5"
                            : selectedAppoint === ""
                                ? "text-sm p-3 rounded bg-red-400 hover:bg-red-600 transition ease-linear mr-5"
                                : "hidden sm:block text-sm p-3 rounded bg-green-300 mr-5"
                    }
                            onClick={(event) => selectAppointment(event)}
                    >
                        {apppointList.length === 0
                            ? (viewEnglish
                                ? "Select relevant appointment" : "Επιλέξτε το σχετικό ραντεβού")
                            : selectedAppoint === ""
                                ? (viewEnglish ? "Close" : "Κλείσιμο") : (
                            viewEnglish ? "Successfully Selected" : "Επιλέχθηκε με επιτυχία"
                        )}
                    </button>

                    {/* Info about the selected relevant appointment */}
                    {
                        selectedAppoint != null && selectedAppoint !== "" && showAppointments !== true
                            ?
                            <form className="w-full mx-auto">
                                <p className={" sm:text-2xl mb-3 text-blue-500 hover:text-blue-700"}>
                                    {viewEnglish ? "Relevant Appointment Information" : "Σχετικές πληροφορίες ραντεβού"}
                                </p>
                                <div className="z-0 w-full mb-5 group">
                                    <input type="email" name="floating_email" id="floating_email" disabled={true}
                                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                           placeholder=" " required
                                           value={selectedAppoint.appointmentDoctor.user.user_name + " " + selectedAppoint.appointmentDoctor.user.user_surname}/>
                                    {/*<label htmlFor="floating_email"*/}
                                    {/*       className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">*/}
                                    {/*    Doctor full-name*/}
                                    {/*</label>*/}
                                </div>
                                <div className="z-0 w-full mb-5 group">
                                    <input type="text" name="floating_password" id="floating_password" disabled={true}
                                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                           placeholder=" " required
                                           value={selectedAppoint.appointmentDoctor.user.email}/>
                                    {/*<label htmlFor="floating_password"*/}
                                    {/*       className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Doctor*/}
                                    {/*    Email</label>*/}
                                </div>
                                <div className="z-0 w-full mb-5 group">
                                    <input type="text" name="repeat_password" id="floating_repeat_password"
                                           disabled={true}
                                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                           placeholder=" " required
                                           value={selectedAppoint.appointmentDoctor.doctorSpeciality.specialityDescription}/>
                                    {/*<label htmlFor="floating_repeat_password"*/}
                                    {/*       className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">*/}
                                    {/*    Doctor Speciality*/}
                                    {/*</label>*/}
                                </div>
                                <div className="z-0 w-full mb-5 group">
                                    <input type="text" name="floating_first_name" id="floating_first_name"
                                           disabled={true}
                                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                           placeholder=" " required
                                           value={selectedAppoint.appointmentPatient.user.user_name + " " + selectedAppoint.appointmentPatient.user.user_surname}/>
                                    {/*<label htmlFor="floating_first_name"*/}
                                    {/*       className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">*/}
                                    {/*    Patient Full-Name*/}
                                    {/*</label>*/}
                                </div>
                                <div className="z-0 w-full mb-5 group">
                                    <input type="text" name="floating_last_name" id="floating_last_name"
                                           disabled={true}
                                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                           placeholder=" " required
                                           value={selectedAppoint.appointmentPatient.patient_AMKA}/>
                                    {/*<label htmlFor="floating_last_name"*/}
                                    {/*       className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">*/}
                                    {/*    Patient AMKA*/}
                                    {/*</label>*/}
                                </div>
                                <div className="z-0 w-full mb-5 group">
                                    <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone"
                                           disabled={true}
                                           id="floating_phone"
                                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                           placeholder=" " required value={selectedAppoint.appointmentDate}/>
                                    {/*<label htmlFor="floating_phone"*/}
                                    {/*       className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">*/}
                                    {/*    Appointment Date*/}
                                    {/*</label>*/}
                                </div>
                                <div className="z-0 w-full mb-5 group">
                                    <input type="text" name="floating_company" id="floating_company" disabled={true}
                                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                           placeholder=" " required
                                           value={selectedAppoint.appointmentJustification}/>
                                    {/*<label htmlFor="floating_company"*/}
                                    {/*       className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">*/}
                                    {/*    Appointment Justification*/}
                                    {/*</label>*/}
                                </div>
                                <div className="z-0 w-full mb-5 group">
                                    <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone"
                                           disabled={true}
                                           id="floating_phone"
                                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                           placeholder=" " required value={selectedAppoint.appointmentStartTime}/>
                                    {/*<label htmlFor="floating_phone"*/}
                                    {/*       className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">*/}
                                    {/*    Appointment Start Time*/}
                                    {/*</label>*/}
                                </div>
                                <div className="z-0 w-full mb-5 group">
                                    <input type="text" name="floating_company" id="floating_company" disabled={true}
                                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                           placeholder=" " required value={selectedAppoint.appointmentEndTime}/>
                                    {/*<label htmlFor="floating_company"*/}
                                    {/*       className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">*/}
                                    {/*    Appointment End Time*/}
                                    {/*</label>*/}
                                </div>
                                <button type="none"
                                        className="bg-red-700 p-2 rounded-xl w-full text-white text-lg"
                                        onClick={handleClearClick}>
                                    {viewEnglish ? "Clear" : "Εκκαθάριση"}
                                </button>
                            </form>

                            : ""
                    }

                </div>

                {showAppointments !== false ? (
                    <div className="bg-slate-300 mt-5 mb-5 rounded p-2 max-h-72 overflow-auto shadow-2xl">
                        {apppointList.map(appointment => (
                            <div
                                className="grid grid-cols-3 w-full h-full bg-blue-200 mt-2 rounded p-2 cursor-pointer"
                                onClick={() => handleAppointClick(appointment)}
                            >
                                <div className="flex flex-col justify-start">
                                    {/* Appointment Code */}
                                    <div className="text-xs sm:text-sm font-semibold">
                                        <span className="material-icons-outlined text-gray-600 mx-2 align-text-top">
                                            fact_check
                                        </span>
                                        {"ID: " + appointment.appointmentId}
                                    </div>
                                    {/* Time */}
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        {viewEnglish ? "In" : "Από:"} {appointment.appointmentDate}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        {viewEnglish ? "From" : "Εώς:"} {appointment.appointmentStartTime} to {appointment.appointmentEndTime}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-xs sm:text-sm font-semibold">{viewEnglish ? "Reason for the appointment" : "Αιτιολογία Ραντεβού"}</div>
                                    <div className="text-xs sm:text-sm">
                                        {appointment.appointmentJustification}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <></>}

                <div className={"bg-slate-300 rounded-xl p-2"}>
                    <div className="z-0 w-full mb-5 group flex items-center">
                        <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">
                            edit_note
                        </span>
                        <textarea
                            className="p-2 text-sm sm:text-lg border border-gray-300 rounded w-full h-40"
                            placeholder={viewEnglish ? "Enter the detected health problems" : "Εισάγετε τα εντοπισμένα προβλήματα υγείας"}
                            value={healthProblem}
                            onChange={(event) => handleDetectedHealthProblemsChange(event)}
                        />
                    </div>

                    <div className= "z-0 w-full mb-5 group flex items-center">
                        <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">
                            edit_note
                        </span>
                        <textarea
                            className="p-2 text-sm sm:text-lg border border-gray-300 rounded w-full h-40"
                            placeholder={viewEnglish ? "Enter the suggested treatment" : "Εισάγετε την προτεινόμενη θεραπεία"}
                            value={suggestedTreatment}
                            onChange={(event) => handleSuggestedTreatmentChange(event)}
                        />
                    </div>
                </div>

                {
                    showAlert.length !== 0 ? showAlert === "The creation has been done successfully" ?
                        <Alert color="green" className={"mt-2 p-2"}>Success: {showAlert}</Alert> :
                        <Alert color="red" className={"mt-2 p-2"}>Error: {showAlert}</Alert> : ""
                }

                <button
                    className={"bg-green-400 p-2 text-cyan-50 rounded w-full hover:bg-green-500 transition ease-linear mt-2"}
                    onClick={(event) => handleSubmitButton(event)}
                >
                    {viewEnglish ? "Submit" : "Καταχώρηση"}
                </button>


            </form>
        </div>
    );
}