import React, {useContext, useEffect, useState} from 'react';
import UserService from "../../../services/UserService";
import DisplayInfoAppointment from "./DisplayInfoAppointment";
import GlobalContext from "../../../context/GlobalContext";
import DisplayInfoPatient from "./DisplayInfoPatient";
import DisplayReg from "./DisplayReg";
import SuccessApp from "../../Success/SuccessApp";

/* bigTitle and smallTitle is for the use of this component in the component ConfigureHistoryReg.
*  The state has value 1 when the component is being used from the component ConfigureHistoryReg*/
export default function SearchPatients({bigTitle, smallTitle, componentState}) {

    const {
        viewDisplayPatientComponent,
        setViewDisplayPatientComponent,
        viewLastReg,
        setViewLastReg,
        patientHistoryToSee,
        setPatientHistoryToSee,
        viewEnglish
    } = useContext(GlobalContext);

    const [inputAMKAValue, setInputAMKAValue] = useState('');
    const [inputSurnameValue, setInputSurnameValue] = useState('');

    const [patientResultsList, setPatientResultsList] = useState('');

    const [patientToView, setPatientToView] = useState(false)


    const handleInputAMKAChange = (event) => {
        setInputAMKAValue(event.target.value);
    };

    const handleInputSurnameChange = (event) => {
        setInputSurnameValue(event.target.value)
    }

    async function handleButtonClick() {
        const params = {
            AMKA: inputAMKAValue,
            surname: inputSurnameValue
        }
        const responseList = await UserService.searchPatients(params)
        if (responseList[0].statusCode === 404) {
            setPatientResultsList([])
        } else
            setPatientResultsList(responseList)
    }

    useEffect(() => {
        handleButtonClick()
    }, [viewDisplayPatientComponent]);

    async function handleViewPatient(patientId) {

        //
        if(componentState !== 1 && componentState !== 2) {
            const params = {
            ID: patientId
            }
            const responseDetails = await UserService.displayPatientsById(params)
            if (responseDetails.statusCode === 200) {
                console.log(responseDetails)
                setPatientToView(responseDetails)
                setViewDisplayPatientComponent(true)
            }
        } else if(componentState === 1) {
            const params = {
                patientId: patientId
            }
            const response = await UserService.getLastPatientHistoryReg(params)
            setPatientToView(response) /* if the response is failure we dont care we will handle it properly in the component */
            setViewLastReg(true)
        } else if(componentState === 2) {
            const params = {
                patientId: patientId
            }
            const response = await UserService.getAllPatientHistory(params)
            setPatientHistoryToSee(response) // might be an error we will handle it in the component Display All history
        }
    }

    /* pagination settings */

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalItems = patientResultsList !== null
        ? patientResultsList.length
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

    const paginatedData = patientResultsList !== null
        ? getPaginatedData(patientResultsList)
        : [];

    /*---------------------------------------------*/

    return (
        <div className="flex flex-col h-min w-full p-3 sm:p-4">
            <p className="font-light mr-10 sm:mr-0 text-3xl md:text-5xl">
                {bigTitle && bigTitle.length !== 0 ? bigTitle : (viewEnglish ? "Search patients based on criteria" : "Αναζήτηση ασθενών βάση κριτιριών")}
            </p>
            <p className="mt-2 mr-10 sm:mr-0 font-light text-slate-400 text-sm md:text-base">
                {smallTitle && smallTitle.length !== 0 ? smallTitle : (viewEnglish ? "If you don't give any search criteria, all the patients will be returned"
                    : "Άμα δεν δωθούν κριτίρια αναζήτησης, όλοι οι ασθενείς θα επιστραφούν")}
            </p>
            <div className="grid grid-cols-3 mr-10 sm:mr-0 p-4 gap-4 h-min">
                <div className="col-span-1 w-full">
                    <form className="w-full">
                        <div className="">
                            <input
                                type="text"
                                onChange={handleInputAMKAChange}
                                placeholder={viewEnglish ? "Patient AMKA" : "ΑΜΚΑ ασθενούς"}
                                className="w-full bg-white h-10 sm:px-5 sm:pr-10 rounded-full text-xs sm:text-sm focus:outline-none"
                            />
                        </div>
                    </form>
                </div>
                <div className="col-span-1 w-full">
                    <form className="w-full">
                        <div className="">
                            <input
                                type="text"
                                onChange={handleInputSurnameChange}
                                placeholder={viewEnglish ? "Patient surname" : "Επώνυμο ασθενούς"}
                                className="bg-white h-10 sm:px-5 sm:pr-10 rounded-full text-xs sm:text-sm focus:outline-none w-full"
                            />
                        </div>
                    </form>
                </div>

                {/* Search Button */}
                <div className="flex justify-center w-full">
                    <form className="w-full">
                        <input
                            type="button"
                            value={viewEnglish ? "Search" : "Αναζήτηση"}
                            className="bg-blue-500 text-white px-2 py-2 sm:px-4 sm:py-2 rounded cursor-pointer hover:bg-blue-700 w-full"
                            onClick={handleButtonClick}
                        />
                    </form>
                </div>
            </div>

            {/* Map the results */}
            <div className="items-center w-full h-min">
                <div className="flex flex-col w-full h-full">
                    {
                        patientResultsList && patientResultsList.length !== 0
                            ? paginatedData.map(patient => (
                                <div
                                    key={patient.patientId}
                                    className="flex flex-col cursor-pointer w-full p-4 rounded-2xl bg-blue-300 hover:shadow-lg transition-shadow duration-300 mb-4"
                                    onClick={() => handleViewPatient(patient.patientId)}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full h-full">
                                        <div className="flex flex-col justify-start">
                                            <div className="text-lg font-semibold flex items-center">
                                              <span className="material-icons-outlined text-gray-600 mr-2">
                                                person
                                              </span>
                                                {patient.patientUser.user_name} {patient.patientUser.user_surname}
                                            </div>
                                            <div className="text-sm">
                                                {"AMKA: " + patient.patientAMKA}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : "No patients found, try again"
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
            {viewDisplayPatientComponent && (componentState !== 1 || componentState !== 2) ? (
                <DisplayInfoPatient patient={patientToView}/>
            ) : viewLastReg && componentState === 1 ? (
                <DisplayReg patient={patientToView}/>
            ) : (
                ""
            )}
        </div>
    );

}