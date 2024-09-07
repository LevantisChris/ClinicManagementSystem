import React, {useContext, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import LoadingApp from "../../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";
import GlobalContext from "../../../context/GlobalContext";
import {Card, Typography, Input, Button} from "@material-tailwind/react";
import UserService from "../../../services/UserService";

export default function DisplayInfoPatient({patient}) {

    const {
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        viewDisplayPatientComponent,
        setViewDisplayPatientComponent,
        viewEnglish
    } = useContext(GlobalContext);

    const TABLE_HEAD = [(viewEnglish ? "Appointment Date" : "Ημερομηνία ραντεβού"),
        (viewEnglish ? "Appointment Start Time" : "Ώρα έναρξης ραντεβού"),
        (viewEnglish ? "Appointment End Time" : "Ώρα λήξης ραντεβού"),
        (viewEnglish ? "Appointment Justification" : "Αιτιολόγηση ραντεβού")];

    const [loading, setLoading] = useState(false)

    /* List that has all the appointments a patient has */
    const [appointmentList, setAppointmentList] = useState([])

    /* This represents the state that the user wants to update a patient.
    *  The info will be visual as input fields. */
    const [updateState, setUpdateState] = useState(false)
    /* Keep track of the values changing in the update state */
    const [newName, setNewName] = useState("")
    const [newSurname, setNewSurname] = useState("")
    const [newAMKA, setNewAMKA] = useState("")
    const [newIdNumber, setNewIdNumber] = useState("")
    const [newEmail, setNewEmail] = useState("")

    function handleUpdateButtonClicked() {
        setNewAMKA("")
        setNewName("")
        setNewSurname("")
        setNewIdNumber("")
        setNewEmail("")
        //
        console.log("The user click the Update Button.")
        setUpdateState(true)
    }

    /* fetch the patient appointments, when the state viewDisplayPatientComponent is triggered */
    useEffect(() => {
        const getPatientAppointments = async () => {
            const params = {
                patientId: patient.patientId,
           };
            const response = await UserService.getPatientAppointments(params)
            setAppointmentList(response.appointmentList)
            console.log(response)
        }
        getPatientAppointments();
    }, [patient.patientId, viewDisplayPatientComponent]);

    function handleGoBackButton() {
        if(!updateState)
            setUpdateState(true)
        else
            setUpdateState(false)
    }

    async function handleDeleteButtonClick() {
        console.log("The user click the Delete Button.")
        const params = {
            patientId: patient.patientId
        }
        const response = await UserService.deletePatient(params)
        if (response.statusCode === 200) {
            setViewDisplayPatientComponent(false);
            setLoading(false)
        } else {
            if(response.message === "DataIntegrityViolationException") {
                setErrorMessage("The patient has appointments, cannot delete him.")
            } else {
                setErrorMessage(response.message)
            }
            setLoading(false)
            setUpdateState(false)
        }
    }

    async function handleSubmitUpdateButton() {
        const updateData = {
            patientId: patient.patientId,
            patientAMKA: newAMKA,
            patientName: newName,
            patientSurname: newSurname,
            patientIdNumber: newIdNumber,
            patientEmail: newEmail
        }
        const response = await UserService.updatePatient(updateData)
        if (response.statusCode === 200) {
            setViewDisplayPatientComponent(false);
            setLoading(false)
        } else {
            if(response.message === "DataIntegrityViolationException") {
                setErrorMessage("AMKA already exists.")
            } else {
                setErrorMessage(response.message)
            }
            setLoading(false)
            setUpdateState(false)
        }
    }

    /* Keep track of the values change */
    function handleChangeName(event) {
        setNewName(event.target.value)
    }

    function handleChangeSurname(event) {
        setNewSurname(event.target.value)
    }

    function handleChangeEmail(event) {
        setNewEmail(event.target.value)
    }

    function handleChangeIdNumber(event) {
        setNewIdNumber(event.target.value)
    }

    function handleChangeAMKA(event) {
        setNewAMKA(event.target.value)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto "
        >
            {
                loading ? (
                    <LoadingApp />
                ) : successMessage !== null ? (
                    <SuccessApp />
                ) : errorMessage !== null ? (
                    <ErrorApp />
                ) : (
                    <div
                        className="flex flex-col justify-between p-5 bg-white rounded-lg cursor-default shadow-2xl ml-2 mr-2 w-max sm:w-5/12 max-w-full h-5/6 overflow-auto">
                        <header className="rounded  bg-slate-200 px-4 py-2 flex justify-between items-center">
                            {!updateState ?
                                <p className="text-xl sm:text-4xl text-black font-black hover:text-sky-700">
                                    {patient.patientUser.user_name} {patient.patientUser.user_surname}
                                </p>
                                : <p className="text-lg sm:text-3xl text-black font-black hover:text-sky-700">
                                    {viewEnglish ? "Provide the new info about the patient" : "Παρέχετε τις νέες πληροφορίες για τον ασθενή"}
                                </p>
                            }
                            <div>
                                <button
                                    onClick={() => {
                                        setViewDisplayPatientComponent(false);
                                    }}
                                >
                                    <span
                                        className="material-icons-outlined text-black-400 hover:bg-red-400 rounded-xl transition duration-500 ease-in-out">
                                        close
                                    </span>
                                </button>
                            </div>
                        </header>

                        <div className={ !updateState
                            ? "flex-grow mt-2 rounded-xl bg-slate-200 border-4 p-5 gap-6 grid grid-cols-1"
                            : "flex-grow mt-2 rounded-xl bg-gradient-to-r bg-blue-300 border-4 p-5 gap-6 grid grid-cols-1"}
                        >
                            {
                                !updateState ? (
                                    <>
                                        <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                            Email: {patient.patientUser.email}
                                        </p>
                                        <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                            {viewEnglish ? "ID number:" : "Αριθμός ταυτότητας:"} {patient.patientUser.user_idNumber}
                                        </p>
                                        <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                            AMKA: {patient.patientAMKA}
                                        </p>
                                        <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                            {viewEnglish ? "System registration date:" : "Ημερομηνία καταχώρησης:"} {patient.patientRegistrationDate}
                                        </p>
                                    </>
                                ) : (
                                    <div className="flex w-full p-4 flex-col items-start gap-10">
                                        <Input size="sm" label={viewEnglish ? "Provide the new name" : "Δώστε το νέο όνομα"} placeholder={patient.patientUser.user_name} onChange={(event) => handleChangeName(event)}/>
                                        <Input size="sm" label={viewEnglish ? "Provide the new surname" : "Δώστε το νέο επώνυμο"} placeholder={patient.patientUser.user_surname} onChange={(event) => handleChangeSurname(event)}/>
                                        <Input size="sm" label={viewEnglish ? "Provide the new email" : "Δώστε το νέο email"} placeholder={patient.patientUser.email} onChange={(event) => handleChangeEmail(event)}/>
                                        <Input size="sm" label={viewEnglish ? "Provide the new ID number" : "Δώστε το νέο αριθμό ταυτότητας"} placeholder={patient.patientUser.user_idNumber} onChange={(event) => handleChangeIdNumber(event)}/>
                                        <Input size="sm" label={viewEnglish ? "Provide the new AMKA number" : "Δώστε τον νέο αριθμό ΑΜΚΑ"} placeholder={patient.patientAMKA} onChange={(event) => handleChangeAMKA(event)}/>
                                        <Button className={"size-9 w-full bg-green-600"} onClick={handleSubmitUpdateButton}>{viewEnglish ? "Submit" : "Υποβολη"}</Button>
                                    </div>
                                )
                            }
                        </div>

                        {/* Here the patient history will be added */}
                        {!updateState ?
                            <Card className="mt-5 h-full w-full overflow-scroll border">
                                <table className="w-full min-w-max table-auto text-left">
                                    <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th
                                                key={head}
                                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        appointmentList.length !== 0 ? appointmentList.map((appointment, index) => {
                                        const isLast = index === appointmentList.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={appointment.appointmentId}>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {appointment.appointmentDate}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {appointment.appointmentStartTime}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {appointment.appointmentEndTime}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {appointment.appointmentJustification}
                                                    </Typography>
                                                </td>
                                            </tr>
                                        );
                                    }) : ""
                                    }
                                    </tbody>
                                </table>
                            </Card> : ""
                        }
                        <footer className="px-4 py-2 flex justify-between items-center">
                            {!updateState ?
                                <>
                                    <div>
                                        <button
                                            className="bg-blue-400 p-3 sm:p-4 text-black-400 hover:bg-blue-600 rounded-xl transition duration-500 ease-in-out"
                                            onClick={handleUpdateButtonClicked}>
                                            {viewEnglish ? "Update patient" : "Ενημέρωση ασθενούς"}
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="bg-red-400 p-3 sm:p-4 text-black-400 hover:bg-red-600 rounded-xl transition duration-500 ease-in-out"
                                            onClick={handleDeleteButtonClick}>
                                            {viewEnglish ? "Delete patient" : "Διαγραφή ασθενούς"}
                                        </button>
                                    </div>
                                </>
                                :
                                <div className={"w-full"}>
                                    <button
                                        className="bg-blue-400 p-4 text-black-400 rounded-xl w-full"
                                        onClick={handleGoBackButton}>
                                        {viewEnglish ? "Go back" : "Επιστροφή"}
                                    </button>
                                </div>
                            }
                        </footer>
                    </div>
                )
            }
        </motion.div>
    );
}