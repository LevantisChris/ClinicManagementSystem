import {React, useContext, useState} from 'react'
import * as XLSX from "xlsx";
import UserService from "../../../services/UserService";
import LoadingApp from "../../Loading/LoadingApp";
import {Button, Card, Typography} from "@material-tailwind/react";
import GlobalContext from "../../../context/GlobalContext";

export default function CreatePatientsHistoryMassively() {

    const {
        viewEnglish
    } = useContext(GlobalContext)

    const TABLE_HEAD = [
        viewEnglish ? "Status" : "Κατάσταση",
        viewEnglish ? "Relevant Appointment ID" : "ID σχετικού ραντεβού",
        viewEnglish ? "Detected Health Problems" : "Εντοπισμένα προβλήματα υγείας",
        viewEnglish ? "Suggested Treatment" : "Προτεινόμενη θεραπεία"];

    const [TABLE_ROWS, setTABLE_ROWS] = useState([])
    const [loading, setLoading] = useState(false)

    /* To track the unsuccessful registrations, its list */
    const [unsuccedRegistrations, setUnsuccedRegistrations] = useState([])

    const addUnSuccessRegistration = (newValue) => {
        setUnsuccedRegistrations((prevRegistrations) => [
            ...prevRegistrations,
            newValue,
        ]);
    };

    function handleFileUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            console.log(json);
            setTABLE_ROWS(json)
        };
        reader.readAsArrayBuffer(file);
    }

    async function handleSubmitClick() {
        setLoading(true);
        setUnsuccedRegistrations([]) // empty the list

        for (let i = 0; i < TABLE_ROWS.length; i++) {
            const registration = TABLE_ROWS[i];
            const data = {
                patientHistoryRegistrationAppointmentId: registration.patientHistoryRegistrationAppointmentId,
                patientHistoryRegistrationHealthProblems: registration.patientHistoryRegistrationHealthProblems,
                patientHistoryRegistrationTreatment: registration.patientHistoryRegistrationTreatment
            };

            const response = await UserService.createPatientHistoryRegistration(data);

            if (response.statusCode !== 200) {
                addUnSuccessRegistration(registration)
            }
        }
        if (unsuccedRegistrations.length !== 0) {
            console.log("Something went wrong: ", unsuccedRegistrations);
            setTABLE_ROWS([])
        } else {
            console.log("All registrations correctly registered: ", unsuccedRegistrations)
            setTABLE_ROWS([])
        }
        setLoading(false);
    }

    return (
        loading ? ( <LoadingApp/>) :
            <div className="flex flex-col h-min w-full p-5">
                <p className={"font-light text-3xl sm:text-5xl"}>
                    {viewEnglish ? "Create history registrations massively" : "Δημιουργήστε μαζικά εγγραφές ιστορικού"}
                </p>
                <p className={"mt-3 text-sm sm:text-lg font-light text-slate-400"}>
                    {
                        viewEnglish ? "You can use an excel file for doing it, but the file must follow a pattern. Download the file pattern bellow" : "Μπορείτε να χρησιμοποιήσετε ένα αρχείο excel για να το κάνετε αυτό, αλλά το αρχείο πρέπει να ακολουθεί ένα μοτίβο. Κατεβάστε το παρακάτω μοτίβο αρχείου"
                    }
                </p>
                <p className={"font-light text-xs sm:text-sm text-slate-400"}>
                    {viewEnglish ? "Note, if a user dont have a history, the system automatically will create one" : "Σημείωση, εάν ένας χρήστης δεν έχει ιστορικό, το σύστημα θα δημιουργήσει αυτόματα ένα."}
                </p>


                <div className={"grid grid-cols-3 mr-12 sm:mr-0 mt-3"}>

                    <div className="flex items-center justify-center w-full col-span-2">
                        <label htmlFor="dropzone-file"
                               className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">{viewEnglish ? "Click to upload or drag and drop" : "Κάντε κλικ για να φορτώσετε ή σύρετε και αφήστε"}</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{viewEnglish ? "Only Excel files (.xls, .xlsx)" : "Μόνο αρχεία Excel (.xls, .xlsx)"}</p>
                            </div>
                            <input id="dropzone-file" type="file" accept=".xls,.xlsx" className="hidden"
                                   onChange={handleFileUpload} onClick={() => setUnsuccedRegistrations([])}
                            />
                        </label>
                    </div>


                    <div className="flex items-center justify-center w-full ml-2">
                        <a href="src/assets/registrations_pattern.xlsx" download
                           className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-blue-800 dark:bg-blue-700 hover:bg-gray-100 dark:border-blue-600 dark:hover:border-gray-500">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M5 9v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V9m-4 4V3m-4 5 4 4 4-4"/>
                                </svg>
                                <p className="mb-2 text-xs text-center sm:text-sm text-gray-500 dark:text-gray-400"><span
                                    className="font-semibold">{viewEnglish ? "Click to download the pattern file" : "Κάντε κλικ για να κατεβάσετε το βασικό αρχείο"}</span></p>
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400">{viewEnglish ? "Download your file here" : "Κατεβάστε το αρχείο εδώ"}</p>
                            </div>
                        </a>
                    </div>
                </div>

                {TABLE_ROWS.length !== 0 && unsuccedRegistrations.length === 0 ?
                    <div className={"mt-4 mr-10 sm:mr-0 bg-slate-200 rounded p-2"}>
                        <div className={"grid grid-cols-2 gap-2"}>
                            <label id="disabled-input-2" aria-label="disabled input 2"
                                   className={"rounded bg-slate-300 p-2 text-sm sm:text-lg text-center"}
                            >
                                    <span className="material-icons-outlined text-gray-600 mx-2 align-text-top">
                                        fact_check
                                    </span>
                                {viewEnglish ? "The data successfully loaded, when you are ready proceed to the creation" : "Τα δεδομένα φορτώθηκαν με επιτυχία, όταν είστε έτοιμοι προχωρήστε στη δημιουργία"}
                            </label>
                            <Button className={"w-full h-full bg-green-500"} onClick={handleSubmitClick}>
                                {viewEnglish ? "Create registrations" : "Δημιουργια εγγραφών"}
                            </Button>
                        </div>
                        <Card className="w-full overflow-y-auto h-80 mt-4">
                            <table className="w-full min-w-max table-auto text-left overflow-y-auto h-32">
                                <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
                                {TABLE_ROWS.map(registration => (
                                    <tr className="even:bg-blue-gray-50/50">
                                        <td className="p-4">
                                            <span className="material-icons-outlined text-gray-600 mx-2 align-text-top">
                                                check_circle
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {registration.patientHistoryRegistrationAppointmentId}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {registration.patientHistoryRegistrationHealthProblems}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {registration.patientHistoryRegistrationTreatment}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                    : TABLE_ROWS.length === 0 && unsuccedRegistrations.length !== 0 ?
                        <div className={"mr-10 sm:mr-0 mt-2"}>
                            <p className={"text-red-600 font-bold text-lg sm:text-3xl"}>
                                {viewEnglish ? "The following registrations fail to be created, please choose another file" : "Η δημιουργία των ακόλουθων καταχωρίσεων αποτυγχάνει, παρακαλούμε επιλέξτε ένα άλλο αρχείο"}
                            </p>
                            <Card className="h-full w-full overflow-scroll mt-4">
                                <table className="w-full min-w-max table-auto text-left">
                                    <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
                                    {unsuccedRegistrations.map(registration => (
                                        <tr className="even:bg-blue-gray-50/50">
                                            <td className="p-4">
                                            <span className="material-icons-outlined text-gray-600 mx-2 align-text-top text-red-600">
                                                close
                                            </span>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {registration.patientHistoryRegistrationAppointmentId}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {registration.patientHistoryRegistrationHealthProblems}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {registration.patientHistoryRegistrationTreatment}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                        : ""

                }
            </div>
    );
}