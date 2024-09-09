import React, {useContext, useState} from "react";
import {animate , motion} from 'framer-motion'
import GlobalContext from "../../../context/GlobalContext";
import DisplayInfoPatient from "./DisplayInfoPatient";
import {Button, Input} from "@material-tailwind/react";
import UserService from "../../../services/UserService";
import LoadingApp from "../../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";
import {useNavigate} from "react-router-dom";

export default function MyInfo() {

    const {
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        userAuthedDetails,
        setShowMyInfoModal,
        viewEnglish
    } = useContext(GlobalContext);

    const [loading, setLoading] = useState(false)
    const [updateState, setUpdateState] = useState(false)
    /* Keep track of the values changing in the update state */
    const [newName, setNewName] = useState("")
    const [newSurname, setNewSurname] = useState("")
    const [newAMKA, setNewAMKA] = useState("")
    const [newIdNumber, setNewIdNumber] = useState("")
    const [newEmail, setNewEmail] = useState("")

    const navigate = useNavigate();

    function handleUpdateButtonClicked(event) {
        event.preventDefault()
        setNewAMKA("")
        setNewName("")
        setNewSurname("")
        setNewIdNumber("")
        setNewEmail("")
        //
        setUpdateState(true)
    }

    async function handleSubmitUpdateButton() {
        const updateData = {
            patientId: userAuthedDetails.patient_id,
            patientAMKA: newAMKA,
            patientName: newName,
            patientSurname: newSurname,
            patientIdNumber: newIdNumber,
            patientEmail: newEmail
        }
        const response = await UserService.updatePatient(updateData)
        if (response.statusCode === 200) {
            setShowMyInfoModal(false);
            UserService.logout()
            navigate("/auth", {replace: true});
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
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.1, ease: 'easeOut'}}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-default z-50"
        >
            {
                loading ? (
                <LoadingApp />
                ) : successMessage !== null ? (
                <SuccessApp />
                ) : errorMessage !== null ? (
                <ErrorApp />
                ) : (
                        <form
                            className="bg-amber-50 rounded-lg overflow-y-auto shadow-2xl p-2 w-11/12 sm:w-1/2 max-w-full max-h-screen overflow-auto">
                            <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                                <p className="text-slate-700 font-black hover:text-sky-700">
                                    {viewEnglish ? "My Information" : "Η Πληροφορίες μου"}
                                </p>
                                <div>
                                    <button onClick={() => setShowMyInfoModal(false)}>
                                      <span
                                          className="material-icons-outlined text-black-400 hover:bg-red-400 rounded-xl transition duration-500 ease-in-out">
                                        close
                                      </span>
                                    </button>
                                </div>
                            </header>

                            <div className={
                                !updateState
                                    ? "flex-grow mt-2 rounded-xl bg-slate-200 border-4 p-5 gap-6 grid grid-cols-1"
                                    : "flex-grow mt-2 rounded-xl bg-gradient-to-r bg-blue-300 border-4 p-5 gap-6 grid grid-cols-1"}
                            >
                                {
                                    !updateState ? (
                                        <>
                                            <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                                User-ID: {userAuthedDetails.user.user_id}
                                            </p>
                                            <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                                Patient-ID: {userAuthedDetails.patient_id}
                                            </p>
                                            <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                                Name: {userAuthedDetails.user.user_name}
                                            </p>
                                            <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                                Surname: {userAuthedDetails.user.user_surname}
                                            </p>
                                            <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                                ID-Number: {userAuthedDetails.user.user_idNumber}
                                            </p>
                                            <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                                Email: {userAuthedDetails.user.email}
                                            </p>
                                            <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                                {viewEnglish ? "ID number:" : "Αριθμός ταυτότητας:"} {userAuthedDetails.user.user_idNumber}
                                            </p>
                                            <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                                AMKA: {userAuthedDetails.patient_AMKA}
                                            </p>
                                            <p className="text-black text-sm sm:text-lg font-light hover:text-sky-700">
                                                {viewEnglish ? "System registration date:" : "Ημερομηνία καταχώρησης:"} {userAuthedDetails.patientRegistrationDate}
                                            </p>
                                        </>
                                    ) : (
                                        <div className="flex w-full p-4 flex-col items-start gap-10">
                                            <Input size="sm"
                                                   label={viewEnglish ? "Provide the new name" : "Δώστε το νέο όνομα"}
                                                   placeholder={userAuthedDetails.user.user_name}
                                                   onChange={(event) => handleChangeName(event)}
                                            />
                                            <Input size="sm"
                                                   label={viewEnglish ? "Provide the new surname" : "Δώστε το νέο επώνυμο"}
                                                   placeholder={userAuthedDetails.user.user_surname}
                                                   onChange={(event) => handleChangeSurname(event)}
                                            />
                                            <Input size="sm"
                                                   label={viewEnglish ? "Provide the new email" : "Δώστε το νέο email"}
                                                   placeholder={userAuthedDetails.user.email}
                                                   onChange={(event) => handleChangeEmail(event)}
                                            />
                                            <Input size="sm"
                                                   label={viewEnglish ? "Provide the new ID number" : "Δώστε το νέο αριθμό ταυτότητας"}
                                                   placeholder={userAuthedDetails.user.user_idNumber}
                                                   onChange={(event) => handleChangeIdNumber(event)}
                                            />
                                            <Input size="sm"
                                                   label={viewEnglish ? "Provide the new AMKA number" : "Δώστε τον νέο αριθμό ΑΜΚΑ"}
                                                   placeholder={userAuthedDetails.patient_AMKA}
                                                   onChange={(event) => handleChangeAMKA(event)}
                                            />
                                            <p className="text-red-600 font-black hover:text-red-700">
                                                {viewEnglish
                                                    ? "Warning, you will have to log in again"
                                                    : "Προσοχή θα πρέπει να ξανασυνδεθείτε"}
                                            </p>
                                            <Button className={"size-9 w-full bg-green-600"}
                                                    onClick={handleSubmitUpdateButton}
                                            >
                                                {viewEnglish ? "Submit" : "Υποβολη"}
                                            </Button>
                                        </div>
                                    )
                                }
                            </div>
                            <footer className="px-4 py-2 flex justify-between items-center">
                            {!updateState ?
                                    <>
                                        <div className={"w-full"}>
                                            <button
                                                className="bg-blue-400 w-full p-3 sm:p-4 text-white hover:bg-blue-600 rounded-xl transition duration-500 ease-in-out"
                                                onClick={(event) => handleUpdateButtonClicked(event)}
                                            >
                                                {viewEnglish ? "Update My Info" : "Ενημέρωση των πληροφορίων μου"}
                                            </button>
                                        </div>
                                    </>
                                    :
                                    <div className={"w-full"}>
                                        <button
                                            className="bg-blue-400 p-4 text-black-400 rounded-xl w-full"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setUpdateState(false)
                                            }
                                        }
                                        >
                                            {viewEnglish ? "Go back" : "Επιστροφή"}
                                        </button>
                                    </div>
                                }
                            </footer>
                        </form>
                    )
            }
        </motion.div>
    )
}