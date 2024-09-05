import React, {useContext, useState} from 'react';
import {motion} from 'framer-motion';
import LoadingApp from "../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";
import GlobalContext from "../../../context/GlobalContext";

export default function DisplayInfoAppointment({appointment}) {
    const {
        successMessage,
        errorMessage,
        setViewDisplayAppointmentComponent
    } = useContext(GlobalContext);

    const [loading, setLoading] = useState(false)
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
                        className="p-3 sm:p-5 bg-white rounded-lg cursor-default shadow-2xl w-full max-w-xs sm:max-w-lg md:max-w-3xl h-3/4 sm:h-5/6 overflow-auto"
                    >
                        <header className="bg-slate-200 px-4 py-2 flex justify-between items-center">
                            <p className="text-black font-black hover:text-sky-700">
                                ID: {appointment.appointmentId}
                            </p>
                            <div>
                                <button
                                    onClick={() => {
                                        setViewDisplayAppointmentComponent(false);
                                    }}
                                >
                                <span className="material-icons-outlined text-black-400 hover:bg-red-400 rounded-xl transition duration-500 ease-in-out">
                                    close
                                </span>
                                </button>
                            </div>
                        </header>
                        <div className="p-3 sm:p-5 grid grid-cols-1 gap-5">
                            <div className="grid grid-rows-5 bg-slate-200 p-3 rounded">
                                <p className="text-lg sm:text-2xl text-slate-700 font-black hover:text-sky-700 text-center">
                                    Appointment Details
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    Date: {appointment.appointmentDate}
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    Time: {appointment.appointmentStartTime} to {appointment.appointmentEndTime}
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    State: {
                                    appointment.appointmentStateId === 1 ? "Created" :
                                        appointment.appointmentStateId === 2 ? "Respected" :
                                            appointment.appointmentStateId === 3 ? "Completed" :
                                                appointment.appointmentStateId === 4 ? "Canceled" : "Not specified"
                                }
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    Appointment description:
                                </p>
                                <textarea
                                    name="description"
                                    placeholder="Reason for the appointment"
                                    style={{ resize: 'none' }}
                                    disabled
                                    className="pt-3 border-0 text-gray-600 bg-gray-200 w-full rounded border-b-2 focus:outline-none focus:ring-0 focus:border-blue-500"
                                    value={appointment.appointmentJustification}
                                />
                            </div>

                            <div className="grid grid-rows-5 bg-slate-200 p-3 rounded">
                                <p className="text-lg sm:text-2xl text-slate-700 font-black hover:text-sky-700 text-center">
                                    Patient Information
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    Full-name: {appointment.appointmentPatient.user.user_name} {appointment.appointmentPatient.user.user_surname}
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    AMKA: {appointment.appointmentPatient.patient_AMKA}
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    ID Number: {appointment.appointmentPatient.user.user_idNumber}
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    Email: {appointment.appointmentPatient.user.email}
                                </p>
                            </div>

                            <div className="grid grid-rows-5 bg-slate-200 p-3 rounded">
                                <p className="text-lg sm:text-2xl text-slate-700 font-black hover:text-sky-700 text-center">
                                    Doctor Information
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    Full-name: {appointment.appointmentDoctorName} {appointment.appointmentDoctorSurname}
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    Speciality: {appointment.appointmentDoctorSpeciality}
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    System ID: {appointment.appointmentDoctorId}
                                </p>
                                <p className="text-sm sm:text-md text-slate-700 font-black hover:text-sky-700">
                                    Email: {appointment.appointmentDoctorEmail}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </motion.div>
    );

}