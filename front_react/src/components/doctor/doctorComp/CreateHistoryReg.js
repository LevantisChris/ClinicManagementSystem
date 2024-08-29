import React, {useState} from 'react'
import UserService from "../../../services/UserService";
import {Button} from "@material-tailwind/react";

export default function CreateHistoryReg() {

    const [apppointList, setAppointList] = useState([]);
    const [selectedAppoint, setSelectedAppoint] = useState("")
    const [showAppointments, setShowAppointments] = useState(false)

    const selectAppointment = async (event) => {
        event.preventDefault();

        if(showAppointments === true) {
            setAppointList([])
            setShowAppointments(false)
        }

        if(showAppointments === false) {
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
        setSelectedAppoint(appointment.appointmentId)
        setShowAppointments(false)
    }

    return(
        <div className="flex flex-col h-min w-full p-10 cursor-default">
            <p className={"font-light text-5xl"}>
                Create a History Registration
            </p>
            <p className={"mt-2 font-light text-slate-400"}>
                Insert the information about the problem and treatment you suggest
            </p>

            {/* Form to register the user */}
            <form className="w-full h-full mt-5 justify-items-start">


                <div className="relative z-0 w-full mb-5 group flex items-center">
                    <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">
                        star_half
                    </span>
                    <button className={
                        apppointList.length === 0
                            ? "text-sm p-3 rounded bg-slate-300 to-transparent hover:bg-slate-400 transition ease-linear"
                            : selectedAppoint === ""
                                ? "text-sm p-3 rounded bg-red-400 hover:bg-red-600 transition ease-linear"
                                : "text-sm p-3 rounded bg-green-300"
                    }
                            onClick={(event) => selectAppointment(event)}
                    >
                        {apppointList.length === 0 ? "Select relevant appointment" : selectedAppoint === "" ? "Close" : selectedAppoint}
                    </button>
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
                                    <div className="text-sm font-semibold">
                                        <span className="material-icons-outlined text-gray-600 mx-2 align-text-top">
                                            fact_check
                                        </span>
                                        {"ID: " + appointment.appointmentId}
                                    </div>
                                    {/* Time */}
                                    <div className="text-sm text-gray-500">
                                        In {appointment.appointmentDate}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        From {appointment.appointmentStartTime} to {appointment.appointmentEndTime}
                                    </div>
                                    {/* Click to view more info about the appointment */}
                                    <span className="material-icons-outlined text-gray-600">
                                        more_horiz
                                    </span>
                                </div>
                                <div className="flex flex-col justify-start">
                                    {/* Code */}
                                    <div className="text-sm font-semibold">Reason for the appointment</div>
                                    <div className="text-sm">
                                        {appointment.appointmentJustification}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <></>}


                <div className="relative z-0 w-full mb-5 group flex items-center">
                    <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">
                        edit_note
                    </span>
                    <textarea
                        className="p-2 border border-gray-300 rounded w-full h-40"
                        placeholder="Enter the detected health problems"
                    />
                </div>

                <div className="relative z-0 w-full mb-5 group flex items-center">
                    <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">
                        edit_note
                    </span>
                    <textarea
                        className="p-2 border border-gray-300 rounded w-full h-40"
                        placeholder="Enter the suggested treatment"
                    />
                </div>

                <button className={"bg-blue-400 p-2 text-cyan-50 rounded w-full hover:bg-blue-500 transition ease-linear"}>Submit</button>


            </form>
        </div>
    );
}