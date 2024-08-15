import React, {useContext, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import Calendar from 'react-calendar';
import ActiveHoursModalCSS from './compCSS/ActiveHoursModalCSS.css';
import GlobalContext from '../../../context/GlobalContext';
import UserService from "../../../services/UserService";
import LoadingApp from "../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";

export default function ActiveHoursModal({onClose}) {
    const {
        selectedOptions,
        setSelectedOptions,
        clearList,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage
    } = useContext(GlobalContext);

    const [date, setDate] = useState(new Date());
    const [isDragging, setIsDragging] = useState(false);
    const dragItemRef = useRef(null);
    const [draggedId, setDraggedId] = useState(null);
    const [hours, setHours] = useState([]);
    const [loading, setLoading] = useState(false)

    const am_str = "AM";
    const pm_str =  "PM";

    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    const handleDateChange = newDate => {
        setDate(newDate);
        console.log('Selected date:', date);
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
            setShowSubmitDialog(false);
            setDraggedId(`${minute}-${hourId}`);
            addToList(`${hourId}:${minute}:${amfm_str}`);
            //console.log('Dragging over MouseMove:', hourId, minute);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        dragItemRef.current = null;
        //setDraggedId(null);
        setShowSubmitDialog(true);
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
        console.log("Hours Selected: ", selectedOptions)

        /* We will modify the date and first, last value of the
        *  array selected option to be able to send them in the backend
        *  in the corrected form. */

        // Extracting the date and formatting it to yyyy-MM-dd
        const formattedDate = date.toISOString().split('T')[0];
        console.log("Formatted Date: ", formattedDate);

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

        console.log("Formatted Start Time: ", formattedStartTime);
        console.log("Formatted End Time: ", formattedEndTime);

        /* Make the request to the backend */
        getDoctorFromId(formattedDate, formattedStartTime, formattedEndTime);
    }

    async function getDoctorFromId(formattedDate, formattedStartTime, formattedEndTime) {
        const response = await UserService.getDoctorIdFromToken();
        sendRequest(formattedDate, formattedStartTime, formattedEndTime, response.doctorId);
    }

    async function sendRequest(formattedDate, formattedStartTime, formattedEndTime, doctorId) {
        console.log(Number(doctorId))
        const response = await UserService.defineWorkingHours(
            {
                workingHoursDate: formattedDate,
                startTime: formattedStartTime + ":00",
                endTime: formattedEndTime + ":00",
                doctorId: Number(doctorId)
            }
        )
        console.log(response)
        if (response.statusCode === 200) {
            setLoading(false)
            setSuccessMessage(response.message)
        } else {
            setErrorMessage(response.message)
        }
    }

    function handleClose() {
        setShowSubmitDialog(false)
        clearList();
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.1, ease: 'easeOut'}}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
            {loading ? (
                <LoadingApp />
            ) : successMessage !== null ? (
                <SuccessApp />
            ) : errorMessage !== null ? (
                <ErrorApp />
            ) : (
            <div className="grid grid-cols-2 gap-4 w-10/12 h-3/6 bg-white shadow-2xl p-5 relative">
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    className="row-span-2 h-full"
                />

                <header className="col-span-1">
                    <p className="text-slate-700 font-black hover:text-sky-700">
                        {date.toDateString()}
                    </p>
                </header>

                <form className="overflow-auto">
                    <div className="grid grid-cols-1 gap-4 bg-white">
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.2, ease: 'easeOut'}}
                            className="overflow-y-auto"
                            style={{maxHeight: '600px'}}
                        >
                            {
                                (showSubmitDialog === true && selectedOptions.length > 0) ?
                                    <div
                                        className="absolute right-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                                        <a href="#"
                                           className="block px-4 py-2 text-gray-800 hover:bg-green-200"
                                           onClick={() => handleSubmit()}>Submit</a>
                                        <a href="#"
                                           className="block px-4 py-2 text-gray-800 hover:bg-red-200"
                                           onClick={() => handleClose()}>Close</a>
                                    </div>
                                    : ""
                            }
                            {hours.map(hour => (
                                <React.Fragment key={hour.id}>
                                <div
                                    id={"00-" + hour.id}
                                        className={`border rounded-md p-2 ${(draggedId === "00-" + hour.id && isDragging) || selectedOptions.includes(`${hour.id}:00:${hour.ampm === pm_str ? pm_str : am_str}`) ? "bg-blue-400 transition duration-100 ease-in-outs" : "NOT"}`}
                                        onMouseDown={e => handleMouseDown(e, hour.id, '00')}
                                        onMouseMove={e => handleMouseMove(e, hour.id, '00', hour.ampm === pm_str ? pm_str : am_str)}
                                        onMouseUp={handleMouseUp}
                                        onTouchStart={e => handleTouchStart(e, hour.id, '00')}
                                        onTouchMove={e => handleTouchMove(e, hour.id, '00')}
                                        onTouchEnd={handleTouchEnd}
                                        onTouchCancel={handleTouchCancel}
                                    >
                                    <span className="text-slate-700 font-bold">
                                      {hour.hour === 12 && hour.ampm === pm_str ? (<>
                                          <span className="material-icons-outlined text-yellow-600 mr-1">
                                            light_mode
                                          </span>
                                              {hour.hour}
                                          </>) : hour.hour === 12 && hour.ampm === am_str ? (<>
                                          <span className="material-icons-outlined text-blue-600 mr-1">
                                            dark_mode
                                          </span>
                                              {hour.hour}
                                          </>) : (hour.hour)}
                                    </span>
                                        <span className="text-slate-600 ml-1">{hour.ampm}</span>
                                    </div>
                                    <React.Fragment>
                                        <div
                                            className={`border rounded-md p-2 text-xs ${(draggedId === "15-" + hour.id && isDragging) || selectedOptions.includes(`${hour.id}:15:${hour.ampm === pm_str ? pm_str : am_str}`) ? "bg-blue-200 transition duration-300 ease-in-outs" : "NOT"}`}
                                            id={"15-" + hour.id}
                                            onMouseDown={(e) => handleMouseDown(e, hour.id, 15)}
                                            onMouseMove={(e) => handleMouseMove(e, hour.id, 15, hour.ampm === pm_str ? pm_str : am_str)}
                                            onMouseUp={handleMouseUp}
                                            //onMouseLeave={handleMouseLeave}
                                            onTouchStart={(e) => handleTouchStart(e, hour.id, 15)}
                                            onTouchMove={(e) => handleTouchMove(e, hour.id, 15)}
                                            onTouchEnd={handleTouchEnd}
                                            onTouchCancel={handleTouchCancel}
                                        >
                                            {hour.hour}:15 {hour.ampm === pm_str ? pm_str : am_str}
                                        </div>

                                        <div
                                            className={`border rounded-md p-2 text-xs ${() => "w-3/6"} ${(draggedId === "30-" + hour.id && isDragging) || selectedOptions.includes(`${hour.id}:30:${hour.ampm === pm_str ? pm_str : am_str}`) ? "bg-blue-200" : "NOT"}`}
                                            id={"30-" + hour.id}
                                            onMouseDown={(e) => handleMouseDown(e, hour.id, 30)}
                                            onMouseMove={(e) => handleMouseMove(e, hour.id, 30, hour.ampm === pm_str ? pm_str : am_str)}
                                            onMouseUp={handleMouseUp}
                                            //onMouseLeave={handleMouseLeave}
                                            onTouchStart={(e) => handleTouchStart(e, hour.id, 30)}
                                            onTouchMove={(e) => handleTouchMove(e, hour.id, 30)}
                                            onTouchEnd={handleTouchEnd}
                                            onTouchCancel={handleTouchCancel}
                                        >
                                            {hour.hour}:30 {hour.ampm === pm_str ? pm_str : am_str}
                                        </div>

                                        <div
                                            className={`border rounded-md p-2 text-xs ${() => "w-3/6"} ${(draggedId === "45-" + hour.id && isDragging) || selectedOptions.includes(`${hour.id}:45:${hour.ampm === pm_str ? pm_str : am_str}`) ? "bg-blue-200 transition duration-00 ease-in-outs" : "NOT"}`}
                                            id={"45-" + hour.id}
                                            onMouseDown={(e) => handleMouseDown(e, hour.id, 45)}
                                            onMouseMove={(e) => handleMouseMove(e, hour.id, 45, hour.ampm === pm_str ? pm_str : am_str)}
                                            onMouseUp={handleMouseUp}
                                            //onMouseLeave={handleMouseLeave}
                                            onTouchStart={(e) => handleTouchStart(e, hour.id, 45)}
                                            onTouchMove={(e) => handleTouchMove(e, hour.id, 45)}
                                            onTouchEnd={handleTouchEnd}
                                            onTouchCancel={handleTouchCancel}
                                        >
                                            {hour.hour}:45 {hour.ampm === pm_str ? pm_str : am_str}
                                        </div>
                                    </React.Fragment>
                                </React.Fragment>))
                            }
                        </motion.div>
                    </div>
                </form>

                <div className={"bg-red-500 flex flex-col items-center justify-center h-full col-span-2 rounded-2xl cursor-pointer"}
                     onClick={onClose}
                >
                    <button
                        onClick={onClose}
                        className="text-white text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
            )}
        </motion.div>)
}
