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
                </div>
                :
                <div
                    className="flex flex-col justify-between p-5 bg-white rounded-lg cursor-default shadow-2xl w-5/12 max-w-full h-5/6 overflow-auto">
                    <header className="rounded  bg-slate-200 px-4 py-2 flex justify-between items-center">
                        <p className="text-4xl text-black font-black hover:text-sky-700">
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
                </div>
            }
        </motion.div>
    );
}