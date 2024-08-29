import React, {useState} from 'react'
import UserService from "../../../services/UserService";

export default function CreateHistoryReg() {

    const [apppointList, setAppointList] = useState([])

    const selectAppointment = async (event) => {
        event.preventDefault();
        const appointmentsList = await UserService.getCreateAndRespectedAppointments();
        if (appointmentsList.length !== 0) {
            console.log(appointmentsList);
            setAppointList(appointmentsList)
        } else {
            console.log("The appointments List is empty");
        }
    };


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
                    <button className={"text-sm p-3 rounded bg-slate-300 to-transparent"}
                            onClick={(event) => selectAppointment(event)}
                    >
                        Select relevant appointment
                    </button>
                </div>

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


                {/*<div className="relative z-0 w-full mb-5 group flex items-center">*/}
                {/*    <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">*/}
                {/*        account_circle*/}
                {/*    </span>*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        name="floating_AMKA"*/}
                {/*        id="floating_AMKA"*/}
                {/*        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"*/}
                {/*        placeholder="Patient AMKA"*/}
                {/*        required*/}
                {/*        value={AMKA}*/}
                {/*        onChange={(e) => setAMKA(e.target.value)}*/}
                {/*    />*/}
                {/*</div>*/}


                {/*<div className="relative z-0 w-full mb-5 group">*/}

                {/*    <div className="inline-flex items-center">*/}
                {/*        <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">*/}
                {/*            edit_note*/}
                {/*        </span>*/}
                {/*        <label className="relative flex items-center p-3 -mt-5 rounded-full cursor-pointer"*/}
                {/*               htmlFor="description">*/}
                {/*            <input type="checkbox"*/}
                {/*                   className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"*/}
                {/*                   id="description"/>*/}
                {/*            <span*/}
                {/*                className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">*/}
                {/*          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20"*/}
                {/*               fill="currentColor"*/}
                {/*               stroke="currentColor" stroke-width="1">*/}
                {/*            <path fill-rule="evenodd"*/}
                {/*                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"*/}
                {/*                  clip-rule="evenodd"></path>*/}
                {/*          </svg>*/}
                {/*        </span>*/}
                {/*        </label>*/}
                {/*        <label className="mt-px font-light text-gray-700 cursor-pointer select-none"*/}
                {/*               htmlFor="description">*/}
                {/*            <div>*/}
                {/*                <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">*/}
                {/*                    Associated it with an appointment*/}
                {/*                </p>*/}
                {/*                <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700">*/}
                {/*                    Some registrations might be done during or after an appointment, the appointment*/}
                {/*                    will change state to Completed*/}
                {/*                </p>*/}
                {/*            </div>*/}
                {/*        </label>*/}
                {/*    </div>*/}

                {/*</div>*/}


            </form>
        </div>
    );
}