import React, {useContext, useState} from 'react';
import {motion} from 'framer-motion';
import LoadingApp from "../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";
import GlobalContext from "../../../context/GlobalContext";
import {Card, Typography, Input, Button} from "@material-tailwind/react";
import UserService from "../../../services/UserService";

export default function DisplayInfoPatient({patient}) {

    const TABLE_HEAD = ["Name", "Job", "Employed", ""];
    const TABLE_ROWS = [
        {
            name: "John Michael",
            job: "Manager",
            date: "23/04/18",
        },
        {
            name: "Alexa Liras",
            job: "Developer",
            date: "23/04/18",
        },
        {
            name: "Laurent Perrier",
            job: "Executive",
            date: "19/09/17",
        },
        {
            name: "Michael Levi",
            job: "Developer",
            date: "24/12/08",
        },
        {
            name: "Richard Gran",
            job: "Manager",
            date: "04/10/21",
        },
        {
            name: "Richard Gran",
            job: "Manager",
            date: "04/10/21",
        },
        {
            name: "Richard Gran",
            job: "Manager",
            date: "04/10/21",
        },
        {
            name: "Richard Gran",
            job: "Manager",
            date: "04/10/21",
        },
        {
            name: "Richard Gran",
            job: "Manager",
            date: "04/10/21",
        },
    ];




    const {
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        setViewDisplayPatientComponent,

    } = useContext(GlobalContext);

    const [loading, setLoading] = useState(false)

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
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
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
                        className="flex flex-col justify-between p-5 bg-white rounded-lg cursor-default shadow-2xl w-5/12 max-w-full h-5/6 overflow-auto">
                        <header className="rounded  bg-slate-200 px-4 py-2 flex justify-between items-center">
                            {!updateState ?
                                <p className="text-4xl text-black font-black hover:text-sky-700">
                                    {patient.patientUser.user_name} {patient.patientUser.user_surname}
                                </p>
                                : <p className="text-3xl text-black font-black hover:text-sky-700">
                                    Provide the new info about the patient
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
                                        <p className="text-black text-lg font-light hover:text-sky-700">
                                            Email: {patient.patientUser.email}
                                        </p>
                                        <p className="text-black text-lg font-light hover:text-sky-700">
                                            ID number: {patient.patientUser.user_idNumber}
                                        </p>
                                        <p className="text-black text-lg font-light hover:text-sky-700">
                                            AMKA: {patient.patientAMKA}
                                        </p>
                                        <p className="text-black text-lg  font-light hover:text-sky-700">
                                            System registration date: {patient.patientRegistrationDate}
                                        </p>
                                    </>
                                ) : (
                                    <div className="flex w-full p-4 flex-col items-start gap-10">
                                        <Input size="sm" label="Provide the new name" placeholder={patient.patientUser.user_name} onChange={(event) => handleChangeName(event)}/>
                                        <Input size="sm" label="Provide the new surname" placeholder={patient.patientUser.user_surname} onChange={(event) => handleChangeSurname(event)}/>
                                        <Input size="sm" label="Provide the new email" placeholder={patient.patientUser.email} onChange={(event) => handleChangeEmail(event)}/>
                                        <Input size="sm" label="Provide the new ID number" placeholder={patient.patientUser.user_idNumber} onChange={(event) => handleChangeIdNumber(event)}/>
                                        <Input size="sm" label="Provide the new AMKA number" placeholder={patient.patientAMKA} onChange={(event) => handleChangeAMKA(event)}/>
                                        <Button className={"size-9 w-full bg-green-600"} onClick={handleSubmitUpdateButton}>Submit</Button>
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
                                    {TABLE_ROWS.map(({name, job, date}, index) => {
                                        const isLast = index === TABLE_ROWS.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={name}>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {name}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {job}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {date}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        as="a"
                                                        href="#"
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-medium"
                                                    >
                                                        Edit
                                                    </Typography>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </Card> : ""
                        }
                        <footer className="px-4 py-2 flex justify-between items-center">
                            {!updateState ?
                                <>
                                    <div>
                                        <button
                                            className="bg-blue-400 p-4 text-black-400 hover:bg-blue-600 rounded-xl transition duration-500 ease-in-out"
                                            onClick={handleUpdateButtonClicked}>
                                            Update patient
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="bg-red-400 p-4 text-black-400 hover:bg-red-600 rounded-xl transition duration-500 ease-in-out"
                                            onClick={handleDeleteButtonClick}>
                                            Delete patient
                                        </button>
                                    </div>
                                </>
                                :
                                <div className={"w-full"}>
                                    <button
                                        className="bg-blue-400 p-4 text-black-400 rounded-xl w-full"
                                        onClick={handleGoBackButton}>
                                        Go back
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