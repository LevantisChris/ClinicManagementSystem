import React, {useContext, useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import Calendar from 'react-calendar';
import ActiveHoursModalCSS from './compCSS/ActiveHoursModalCSS.css';
import GlobalContext from '../../../context/GlobalContext';
import UserService from "../../../services/UserService";
import LoadingApp from "../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";
import {data} from "autoprefixer";
import dayjs from "dayjs";

export default function ActiveHoursModal({onClose}) {
    const {
        selectedOptions,
        setSelectedOptions,
        clearList,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        viewEnglish
    } = useContext(GlobalContext);

    const [date, setDate] = useState(new Date());
    const [isDragging, setIsDragging] = useState(false);
    const dragItemRef = useRef(null);
    const [draggedId, setDraggedId] = useState(null);
    const [hours, setHours] = useState([]);
    const [loading, setLoading] = useState(false)
    /* The working hours that are already defined (if there are any, might be null) */
    const [workingHours, setWorkingHours] = useState([]);
    /* The hour that is already
    *  predefined and is the same as the one
    *  the user select.
    *  The hour that was found in the function checkDateSimilarity(...).
    *  We mostly need this in the function delete WH.
    *  */
    const showStartTimeRef = useRef(false);
    const showEndTimeRef = useRef(false);

    const am_str = "AM";
    const pm_str =  "PM";

    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDateChange = newDate => {
        setDate(newDate);
        clearList();
        //console.log('Selected date:', date);
    };

    const handleMouseDown = (event, hourId, minute) => {
        event.preventDefault();
        clearList();
        setShowSubmitDialog(false);
        setIsDragging(true);
        dragItemRef.current = {hourId, minute};
    };

    const handleMouseMove = (event, hourId, minute, amfm_str) => {
        event.preventDefault();
        if (isDragging) {
            //console.log('Dragging over MouseMove:', hourId, minute);
            /* We have to check wheaten that hour the user
            *  select is already selected.
            *  If its already selected then
            *  send request to the server to delete it.
            *  */
            const temp = checkDateSimilarity(
                date.toISOString().split('T')[0],
                (hourId >= 0 && hourId <= 10 ? "0" + hourId : hourId) + ":" + minute + ":00")
            if(temp !== null
            ) {
                //console.log("SAME --> ", hourId, minute)
                setShowDeleteDialog(true)
                setIsDragging(false);
                dragItemRef.current = null;
                //console.log("CHECK: " + temp[0])
                //console.log("CHECK: " + temp[1])
                showStartTimeRef.current = temp[0]
                showEndTimeRef.current = temp[1]
            } else {
                //console.log("Not the same")
                addToList(`${hourId}:${minute}:${amfm_str}`);
                setDraggedId(`${minute}-${hourId}`);
                setShowSubmitDialog(false);

            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        dragItemRef.current = null;
        //setDraggedId(null);
        if(!showDeleteDialog) setShowSubmitDialog(true)
        //console.log("dragging-mouseUp stopped");
    };

    const handleTouchStart = (event, hourId, minute) => {
        event.preventDefault();
        setIsDragging(true);
        //console.log("TouchStart: " + hourId + "-" + minute);
        //setDraggedId(minute + "-" + hourId);
        dragItemRef.current = { hourId, minute };
    };

    const handleTouchMove = (event, hourId, minute) => {
        event.preventDefault();
        if (isDragging) {
            setDraggedId(minute + "-" + hourId);
            //addObjectToList(minute, hourId);
            //console.log("Dragging over TouchMove:", hourId, minute);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        dragItemRef.current = null;
        //setDraggedId(null);
        //console.log("dragging-touchEnd stopped");
    };

    const handleTouchCancel = () => {
        setIsDragging(false);
        dragItemRef.current = null;
        //setDraggedId(null);
        //console.log("dragging-touchCancel stopped");
    };

    const addToList = option => {
        if (!selectedOptions.includes(option)) {
            //console.log("\nTOTAL SELECTED: " + selectedOptions);
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    React.useEffect(() => {
        const generatedHours = [];
        for (let i = 0; i < 24; i++) {
            generatedHours.push({
                id: i,
                hour: i % 12 === 0 ? 12 : i % 12,
                ampm: i < 12 ? am_str : pm_str,
            });
        }
        setHours(generatedHours);
    }, []);

    function handleSubmit() {
        /* set loading true, load the loading component to the user */
        setLoading(true)
        console.log("Day Selected: ", date)

        /* We will modify the date and first, last value of the
        *  array selected option to be able to send them in the backend
        *  in the corrected form. */

        // Extracting the date and formatting it to yyyy-MM-dd
        const formattedDate = formatDateToLocal(date);

        // Extracting the start and end time
        const startTime = selectedOptions[0];
        const endTime = selectedOptions[selectedOptions.length - 1];

        // Converting time to 24-hour format (HH:mm)
        const convertTo24HourFormat = (time12h) => {
            const [time, modifier] = time12h.split(" ");
            let [hours, minutes] = time.split(":");

            if (hours === "12" && modifier === "AM") {
                hours = "00";
            } else if (hours !== "12" && modifier === "PM") {
                hours = parseInt(hours, 10) + 12;
            }

            return `${String(hours).padStart(2, '0')}:${minutes}`;
        };

        const formattedStartTime = convertTo24HourFormat(startTime);
        const formattedEndTime = convertTo24HourFormat(endTime);

        //console.log("Formatted Start Time: ", formattedStartTime);
        //console.log("Formatted End Time: ", formattedEndTime);

        /* Make the request to the backend */
        getDoctorFromId(formattedDate, formattedStartTime, formattedEndTime);
    }

    async function getDoctorFromId(formattedDate, formattedStartTime, formattedEndTime) {
        const response = await UserService.getDoctorIdFromToken();
        sendRequestToDefineWH(formattedDate, formattedStartTime, formattedEndTime, response.doctorId);
    }

    async function sendRequestToDefineWH(formattedDate, formattedStartTime, formattedEndTime, doctorId) {
        //console.log(Number(doctorId))
        const response = await UserService.defineWorkingHours(
            {
                workingHoursDate: formattedDate,
                startTime: formattedStartTime + ":00",
                endTime: formattedEndTime + ":00",
                doctorId: Number(doctorId)
            }
        )
        //console.log(response)
        if (response.statusCode === 200) {
            setLoading(false)
            setShowSubmitDialog(false);
            setSuccessMessage(response.message)
        } else {
            setErrorMessage(response.message)
        }
    }

    function handleCloseSubmitDialog() {
        setShowSubmitDialog(false)
        clearList();
    }

    function handleCloseDeleteDialog() {
        setShowDeleteDialog(false)
    }

    React.useEffect(() => {
        const loadWorkingHours = async () => {
            const token = localStorage.getItem('token');
            if(token) {
                try {
                    const w_hours = await UserService.getWorkingHoursOfADoctor(token);
                    if(w_hours[0].statusCode !== 404) {
                        setWorkingHours(w_hours);
                    }
                } catch (error) {
                    console.error('Failed to fetch working hours:', error);
                }
            }
        }
        loadWorkingHours();
    }, [showSubmitDialog, showDeleteDialog]);

    /* If there are any already predefined working hours we have to display them to the user
    *  In this function we will try to match them, in order to know which of them to "underline" */
    function checkDateSimilarity(calendarDate, calendarTime) {
        if (workingHours != null) {
            const formattedDate = formatDateToLocal(date);  // Local date formatting
            for (const workingHour of workingHours) {
                if (isTimeInRange(calendarTime, workingHour.startTime, workingHour.endTime) && formattedDate === workingHour.workingHoursDate) {
                    return [workingHour.startTime, workingHour.endTime];
                }
            }
        }
        return null;
    }

    function formatDateToLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function isTimeInRange(time, time1, time2) {
        // Base date to compare times (using an arbitrary date since we only care about time)
        const baseDate = '1970-01-01';
        // Convert strings to Date objects
        const timeDate = new Date(`${baseDate}T${time}`);
        const time1Date = new Date(`${baseDate}T${time1}`);
        const time2Date = new Date(`${baseDate}T${time2}`);
        // Check if time is greater than or equal to time1 and less than or equal to time2
        return timeDate >= time1Date && timeDate <= time2Date;
    }


    /* Here we will handle the deletion of the working hours */
    function handleDelete() {
        sendRequestToDeleteWH(date, showStartTimeRef.current, showEndTimeRef.current)
    }

    async function sendRequestToDeleteWH(workingHoursDate, startTime, endTime) {
        setLoading(true)
        try {
            const data = {
                workingHoursDate: formatDateToLocal(workingHoursDate),
                startTime: startTime,
                endTime: endTime
            }
            const response = await UserService.deleteWorkingHours(data)
            if (response.statusCode === 200) {
                setLoading(false)
                setShowDeleteDialog(false);
                setSuccessMessage(response.message)
            } else {
                setLoading(false)
                setErrorMessage(response.message)
            }
        } catch (error) {
            setErrorMessage('An error occurred while defining working hours.');
        } finally {
            setLoading(false);
        }
    }

    function getFullGreekDate(date) {
        console.log("- ", date.toDateString())
        console.log("- ", dayToGreek(date.getDay()))
        console.log("- ", getGreekMonth(date.getMonth()))

        return dayToGreek(date.getDay()) + " " + getGreekMonth(date.getMonth()) + " " + dayjs(date.toDateString()).format('DD') + " " + date.getFullYear();
    }

    /* The date object starts from 0 */
    function getGreekMonth(formattedDate, year) {
        if(formattedDate === 8) {
            return "Σεπτ"
        } else if(formattedDate === 9) {
            return "Οκτ";
        } else if(formattedDate === 10) {
            return "Νοε"
        } else if(formattedDate === 11) {
            return "Δεκ"
        } else if(formattedDate === 0) {
            return "Ιαν"
        } else if(formattedDate === 1) {
            return "Φεβρ"
        } else if(formattedDate === 2) {
            return "Μαρ"
        } else if(formattedDate === 3) {
            return "Απρί"
        } else if(formattedDate === 4) {
            return "Μάι"
        } else if(formattedDate === 5) {
            return "Ιούν"
        } else if(formattedDate === 6) {
            return "Ιούλ"
        } else if(formattedDate === 7) {
            return "Άυγ"
        }

        // Implement Greek date formatting logic here
        return "Greek Date"; // Replace this with the actual Greek date format
    }

    function dayToGreek(s) {
        if(s === 0) {
            return "Κυρ"
        } else if(s === 1) {
            return "Δευ"
        } else if(s === 2) {
            return "Τρι"
        } else if(s === 3) {
            return "Τετ"
        } else if(s === 4) {
            return "Πεμ"
        } else if(s === 5) {
            return "Παρ"
        } else if(s === 6) {
            return "Σαβ"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-default z-50"
        >
            {loading ? (
                <LoadingApp />
            ) : successMessage !== null ? (
                <SuccessApp />
            ) : errorMessage !== null ? (
                <ErrorApp />
            ) : (
                <div
                    className="grid grid-cols-1 grid-rows-4 gap-5 sm:grid-cols-2 sm:grid-rows-1 overflow-x-auto sm:gap-10 w-11/12 max-w-4xl sm:h-[400px] h-5/6 bg-white shadow-2xl p-6 rounded-lg relative"
                >
                    {/* Calendar */}
                    <div className="row-span-3 sm:row-span-2 border-r pr-4 sm:pr-10">
                        <Calendar
                            onChange={handleDateChange}
                            value={date}
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Header */}
                    <p className="text-slate-700 hidden sm:block font-extrabold text-lg hover:text-sky-700 mt-10 sm:mt-0">
                        {viewEnglish ? date.toDateString() : getFullGreekDate(date)}
                    </p>

                    {/* Form */}
                    <form className="overflow-x-auto sm:mt-0 h-full sm:h-[200px]" key={date.toString()}>
                        <div className="space-y-4 bg-white">
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.2, ease: 'easeOut'}}
                                style={{maxHeight: '550px'}}
                            >
                                {showSubmitDialog && selectedOptions.length > 0 ? (
                                    <div
                                        className="absolute right-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                                        <a
                                            className="block px-4 py-2 text-gray-800 hover:bg-green-200"
                                            onClick={handleSubmit}
                                        >
                                            {viewEnglish ? "Submit" : "Καταχώρηση"}
                                        </a>
                                        <a
                                            className="block px-4 py-2 text-gray-800 hover:bg-red-200"
                                            onClick={handleCloseSubmitDialog}
                                        >
                                            {viewEnglish ? "Close" : "Κλείσιμο"}
                                        </a>
                                    </div>
                                ) : showDeleteDialog ? (
                                    <div
                                        className="absolute right-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                                        <a
                                            className="block px-4 py-2 text-red-600 hover:bg-red-400"
                                            onClick={handleDelete}
                                        >
                                            {viewEnglish ? "Delete" : "Διαγραφή"}
                                        </a>
                                        <a
                                            className="block px-4 py-2 text-gray-800 hover:bg-red-200"
                                            onClick={handleCloseDeleteDialog}
                                        >
                                            {viewEnglish ? "Close" : "Κλείσιμο"}
                                        </a>
                                    </div>
                                ) : null}

                                {/* Hours Grid */}
                                {hours.map((hour) => (
                                    <React.Fragment key={hour.id}>
                                        <div
                                            id={"00-" + hour.id}
                                            className={`border rounded-md p-2 mb-1 text-center ${
                                                checkDateSimilarity(date.toISOString().split('T')[0], hour.id.toString().padStart(2, '0') + ":00:00")
                                                    ? "bg-green-600"
                                                    : draggedId === "00-" + hour.id && isDragging || selectedOptions.includes(`${hour.id}:00:${hour.ampm === pm_str ? pm_str : am_str}`)
                                                        ? "bg-blue-400 transition duration-100 ease-in-out"
                                                        : ""
                                            }`}
                                            onMouseDown={(e) => handleMouseDown(e, hour.id, "00")}
                                            onMouseMove={(e) => handleMouseMove(e, hour.id, "00", hour.ampm)}
                                            onMouseUp={handleMouseUp}
                                            onTouchStart={(e) => handleTouchStart(e, hour.id, "00")}
                                            onTouchMove={(e) => handleTouchMove(e, hour.id, "00")}
                                            onTouchEnd={handleTouchEnd}
                                            onTouchCancel={handleTouchCancel}
                                        >
                        <span className="text-slate-700 font-bold">
                            {hour.hour === 12 && hour.ampm === pm_str ? (
                                <>
                                    <span className="material-icons-outlined text-yellow-600 mr-1">
                                        light_mode
                                    </span>
                                    {hour.hour}
                                </>
                            ) : hour.hour === 12 && hour.ampm === am_str ? (
                                <>
                                    <span className="material-icons-outlined text-blue-600 mr-1">
                                        dark_mode
                                    </span>
                                    {hour.hour}
                                </>
                            ) : (
                                hour.hour
                            )}
                        </span>
                                            <span className="text-slate-600 ml-1">{hour.ampm}</span>
                                        </div>

                                        {["15", "30", "45"].map((minute) => (
                                            <div
                                                key={minute}
                                                className={`border rounded-md p-2 text-xs text-center mb-1 ${
                                                    checkDateSimilarity(date.toISOString().split('T')[0], `${hour.id.toString().padStart(2, '0')}:${minute}:00`)
                                                        ? "bg-green-400"
                                                        : draggedId === `${minute}-${hour.id}` && isDragging || selectedOptions.includes(`${hour.id}:${minute}:${hour.ampm === pm_str ? pm_str : am_str}`)
                                                            ? "bg-blue-200 transition duration-300 ease-in-out"
                                                            : ""
                                                }`}
                                                id={`${minute}-${hour.id}`}
                                                onMouseDown={(e) => handleMouseDown(e, hour.id, minute)}
                                                onMouseMove={(e) => handleMouseMove(e, hour.id, minute, hour.ampm)}
                                                onMouseUp={handleMouseUp}
                                                onTouchStart={(e) => handleTouchStart(e, hour.id, minute)}
                                                onTouchMove={(e) => handleTouchMove(e, hour.id, minute)}
                                                onTouchEnd={handleTouchEnd}
                                                onTouchCancel={handleTouchCancel}
                                            >
                                                {hour.hour}:{minute} {hour.ampm === pm_str ? pm_str : am_str}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </motion.div>
                        </div>
                    </form>


                    {/* Close Button */}
                    <div
                        className="bg-red-500 flex flex-col items-center justify-center h-auto sm:h-full sm:col-span-2 rounded-2xl cursor-pointer mt-5 sm:mt-0">
                        <button onClick={onClose} className="text-white text-lg font-semibold">
                            {viewEnglish ? "Close" : "Κλείσιμο"}
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );

}
