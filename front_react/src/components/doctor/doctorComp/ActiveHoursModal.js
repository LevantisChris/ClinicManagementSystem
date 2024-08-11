import React, {useContext, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import Calendar from 'react-calendar';
import ActiveHoursModalCSS from './compCSS/ActiveHoursModalCSS.css';
import GlobalContext from '../../../context/GlobalContext';

export default function ActiveHoursModal({onClose}) {
    const {
        daySelected,
        selectedOptions,
        setSelectedOptions,
        clearList
    } = useContext(GlobalContext);

    const [date, setDate] = useState(new Date());
    const [isDragging, setIsDragging] = useState(false);
    const dragItemRef = useRef(null);
    const [draggedId, setDraggedId] = useState(null);
    const [hours, setHours] = useState([]);

    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    const handleDateChange = newDate => {
        setDate(newDate);
        console.log('Selected date:', newDate);
    };

    const handleMouseDown = (event, hourId, minute) => {
        event.preventDefault();
        clearList();
        setShowSubmitDialog(false);
        setIsDragging(true);
        dragItemRef.current = {hourId, minute};
    };

    const handleMouseMove = (event, hourId, minute) => {
        event.preventDefault();
        if (isDragging) {
            setShowSubmitDialog(false);
            setDraggedId(`${minute}-${hourId}`);
            addToList(`${hourId}:${minute}`);
            console.log('Dragging over MouseMove:', hourId, minute);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        dragItemRef.current = null;
        //setDraggedId(null);
        setShowSubmitDialog(true);
        console.log("dragging-mouseUp stopped");
    };

    const handleTouchStart = (event, hourId, minute) => {
        event.preventDefault();
        setIsDragging(true);
        console.log("TouchStart: " + hourId + "-" + minute);
        //setDraggedId(minute + "-" + hourId);
        dragItemRef.current = { hourId, minute };
    };

    const handleTouchMove = (event, hourId, minute) => {
        event.preventDefault();
        if (isDragging) {
            setDraggedId(minute + "-" + hourId);
            //addObjectToList(minute, hourId);
            console.log("Dragging over TouchMove:", hourId, minute);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        dragItemRef.current = null;
        //setDraggedId(null);
        console.log("dragging-touchEnd stopped");
    };

    const handleTouchCancel = () => {
        setIsDragging(false);
        dragItemRef.current = null;
        //setDraggedId(null);
        console.log("dragging-touchCancel stopped");
    };

    const addToList = option => {
        if (!selectedOptions.includes(option)) {
            console.log("\nTOTAL SELECTED: " + selectedOptions);
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    React.useEffect(() => {
        const generatedHours = [];
        for (let i = 0; i < 24; i++) {
            generatedHours.push({
                id: i,
                hour: i % 12 === 0 ? 12 : i % 12,
                ampm: i < 12 ? "AM" : "PM",
            });
        }
        setHours(generatedHours);
    }, []);

    function isLater() {
        const [firstHours, firstMinutes] = selectedOptions[0]
            .split(":")
            .map(Number);
        const [secondHours, secondMinutes] = selectedOptions[
        selectedOptions.length - 1
            ]
            .split(":")
            .map(Number);
        if (firstHours === secondHours) {
            console.log("PROTO");
            const firstTotalMinutes = firstHours * 60 + firstMinutes;
            const secondTotalMinutes = secondHours * 60 + secondMinutes;
            return firstTotalMinutes < secondTotalMinutes;
        }
        console.log("SECOND");
        return firstHours < secondHours;
    }

    return (<motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.1, ease: 'easeOut'}}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
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
                            {(showSubmitDialog === true && selectedOptions.length > 0) ?
                                <div
                                    className="absolute right-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                                    <a href="#"
                                       className="block px-4 py-2 text-gray-800 hover:bg-green-200"
                                    >Submit</a>
                                    <a href="#"
                                       className="block px-4 py-2 text-gray-800 hover:bg-red-200">Close</a>
                                </div>
                                : console.log("Dont show")}
                            {hours.map(hour => (<React.Fragment key={hour.id}>
                                    <div
                                        id={"00-" + hour.id}
                                        className={`border rounded-md p-2 ${(draggedId === "00-" + hour.id && isDragging) || selectedOptions.includes(`${hour.id}:00`) ? "bg-blue-400 transition duration-100 ease-in-outs" : "NOT"}`}
                                        onMouseDown={e => handleMouseDown(e, hour.id, '00')}
                                        onMouseMove={e => handleMouseMove(e, hour.id, '00')}
                                        onMouseUp={handleMouseUp}
                                        onTouchStart={e => handleTouchStart(e, hour.id, '00')}
                                        onTouchMove={e => handleTouchMove(e, hour.id, '00')}
                                        onTouchEnd={handleTouchEnd}
                                        onTouchCancel={handleTouchCancel}
                                    >
                    <span className="text-slate-700 font-bold">
                      {hour.hour === 12 && hour.ampm === 'PM' ? (<>
                          <span className="material-icons-outlined text-yellow-600 mr-1">
                            light_mode
                          </span>
                              {hour.hour}
                          </>) : hour.hour === 12 && hour.ampm === 'AM' ? (<>
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
                                            className={`border rounded-md p-2 text-xs ${(draggedId === "15-" + hour.id && isDragging) || selectedOptions.includes(`${hour.id}:15`) ? "bg-blue-200 transition duration-300 ease-in-outs" : "NOT"}`}
                                            id={"15-" + hour.id}
                                            onMouseDown={(e) => handleMouseDown(e, hour.id, 15)}
                                            onMouseMove={(e) => handleMouseMove(e, hour.id, 15)}
                                            onMouseUp={handleMouseUp}
                                            //onMouseLeave={handleMouseLeave}
                                            onTouchStart={(e) => handleTouchStart(e, hour.id, 15)}
                                            onTouchMove={(e) => handleTouchMove(e, hour.id, 15)}
                                            onTouchEnd={handleTouchEnd}
                                            onTouchCancel={handleTouchCancel}
                                        >
                                            {hour.hour}:15
                                        </div>

                                        <div
                                            className={`border rounded-md p-2 text-xs ${() => "w-3/6"} ${(draggedId === "30-" + hour.id && isDragging) || selectedOptions.includes(`${hour.id}:30`) ? "bg-blue-200" : "NOT"}`}
                                            id={"30-" + hour.id}
                                            onMouseDown={(e) => handleMouseDown(e, hour.id, 30)}
                                            onMouseMove={(e) => handleMouseMove(e, hour.id, 30)}
                                            onMouseUp={handleMouseUp}
                                            //onMouseLeave={handleMouseLeave}
                                            onTouchStart={(e) => handleTouchStart(e, hour.id, 30)}
                                            onTouchMove={(e) => handleTouchMove(e, hour.id, 30)}
                                            onTouchEnd={handleTouchEnd}
                                            onTouchCancel={handleTouchCancel}
                                        >
                                            {hour.hour}:30
                                        </div>

                                        <div
                                            className={`border rounded-md p-2 text-xs ${() => "w-3/6"} ${(draggedId === "45-" + hour.id && isDragging) || selectedOptions.includes(`${hour.id}:45`) ? "bg-blue-200 transition duration-00 ease-in-outs" : "NOT"}`}
                                            id={"45-" + hour.id}
                                            onMouseDown={(e) => handleMouseDown(e, hour.id, 45)}
                                            onMouseMove={(e) => handleMouseMove(e, hour.id, 45)}
                                            onMouseUp={handleMouseUp}
                                            //onMouseLeave={handleMouseLeave}
                                            onTouchStart={(e) => handleTouchStart(e, hour.id, 45)}
                                            onTouchMove={(e) => handleTouchMove(e, hour.id, 45)}
                                            onTouchEnd={handleTouchEnd}
                                            onTouchCancel={handleTouchCancel}
                                        >
                                            {hour.hour}:45
                                        </div>
                                    </React.Fragment>
                                </React.Fragment>))}
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
        </motion.div>);
}
