import {React, useContext, useState} from 'react'
import {motion} from 'framer-motion';
import GlobalContext from "../../../context/GlobalContext";

export default function DisplayLastReg({patient}) {

    const {
        viewLastReg,
        setViewLastReg
    } = useContext(GlobalContext);

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.1, ease: 'easeOut'}}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
            {patient.statusCode === 200 ?
                <div
                    className="flex flex-col justify-between p-5 bg-white rounded-lg cursor-default shadow-2xl w-5/12 max-w-full h-5/6 overflow-auto">
                    <header className="rounded  bg-slate-200 px-4 py-2 flex justify-between items-center">
                        <p className="text-4xl text-black font-black hover:text-sky-700">
                            {patient.registrationAppointment.appointmentPatient.user.user_name} {patient.registrationAppointment.appointmentPatient.user.user_surname}
                        </p>
                        <div>
                            <button>
                                <span
                                    className="material-icons-outlined text-black-400 hover:bg-red-400 rounded-xl transition duration-500 ease-in-out"
                                    onClick={() => {
                                        setViewLastReg(false)
                                    }}
                                >
                                    close
                                </span>
                            </button>
                        </div>
                    </header>

                    <div className={"flex-grow overflow-x-auto mt-2 rounded-xl border-4 p-5 gap-6 grid grid-cols-1"}>
                        <>
                            <div className={"bg-blue-200 p-2 rounded-xl"}>
                                <p className={"text-black text-2xl font-bold hover:text-sky-700"}>
                                    Registration Information
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Registration ID: {patient.patientHistoryRegistrationId}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Date Register: {patient.patientHistoryRegistrationDateRegister}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Detected Health Problem: {patient.patientHistoryRegistrationHealthProblems}
                                </p>
                                <p className="text-black text-lg  font-light hover:text-sky-700">
                                    Suggested Treatment: {patient.patientHistoryRegistrationTreatment}
                                </p>
                            </div>

                            <div className={"bg-slate-200 p-2 rounded-xl"}>
                                <p className={"text-black text-2xl font-bold hover:text-sky-700"}>
                                    Relative Appointment Information
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Appointment ID: {patient.registrationAppointment.appointmentId}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Start Time: {patient.registrationAppointment.appointmentStartTime}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    End Time: {patient.registrationAppointment.appointmentEndTime}
                                </p>
                                <p className="text-black text-lg  font-light hover:text-sky-700">
                                    Justification: {patient.registrationAppointment.appointmentJustification}
                                </p>
                            </div>

                            <div className={"bg-slate-200 p-2 rounded-xl"}>
                                <p className={"text-black text-2xl font-bold hover:text-sky-700"}>
                                    Patient Information
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Appointment ID: {patient.registrationAppointment.appointmentPatient.patient_id}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    First-Name: {patient.registrationAppointment.appointmentPatient.user.user_name}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Second-Name: {patient.registrationAppointment.appointmentPatient.user.user_surname}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    ID-Number: {patient.registrationAppointment.appointmentPatient.user.user_idNumber}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Email: {patient.registrationAppointment.appointmentPatient.user.email}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    AMKA: {patient.registrationAppointment.appointmentPatient.patient_AMKA}
                                </p>
                            </div>

                            <div className={"bg-slate-200 p-2 rounded-xl"}>
                                <p className={"text-black text-2xl font-bold hover:text-sky-700"}>
                                    Doctor Information
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Doctor ID: {patient.registrationAppointment.appointmentDoctor.doctor_id}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    First-Name: {patient.registrationAppointment.appointmentDoctor.user.user_name}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Second-Name: {patient.registrationAppointment.appointmentDoctor.user.user_surname}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Second-Name: {patient.registrationAppointment.appointmentDoctor.user.email}
                                </p>
                                <p className="text-black text-lg font-light hover:text-sky-700">
                                    Second-Name: {patient.registrationAppointment.appointmentDoctor.doctorSpeciality.specialityDescription}
                                </p>
                            </div>


                        </>
                    </div>

                </div>
                : // No history present
                <div
                    className="flex flex-col justify-between p-5 bg-white rounded-lg cursor-default shadow-2xl w-5/12 max-w-full h-5/6 overflow-auto">
                    <header className="rounded  bg-slate-200 px-4 py-2 flex justify-between items-center">
                        <p className="text-4xl text-red-500 font-black hover:text-red-700">
                            {patient.error}
                        </p>
                        <div>
                            <button>
                                <span
                                    className="material-icons-outlined text-black-400 hover:bg-red-400 rounded-xl transition duration-500 ease-in-out"
                                    onClick={() => {
                                        setViewLastReg(false)
                                    }}
                                >
                                    close
                                </span>
                            </button>
                        </div>
                    </header>

                    <div
                        className="flex-grow mt-2 rounded-xl bg-slate-200 border-4 p-5 flex justify-center items-center">
                        <div className="text-center">
                            <span className="material-icons-outlined text-9xl text-red-600">
                                trending_down
                            </span>
                            <p className="text-xl text-red-600">
                                Cannot find patient history, create a new registration.
                            </p>
                        </div>
                    </div>


                </div>
            }
        </motion.div>
    );
}