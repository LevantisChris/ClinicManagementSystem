import React, { useContext, useState, useRef } from "react";
import GlobalContext from "../context/GlobalContext";
import DescriptionInsertModal from "./DescriptionInsertModal";
import { motion } from "framer-motion";

/* The modal that helps the user pick time slots */

export default function InsertModal() {
  const {
    setShowInsertModal,
    daySelected,
    selectedOptions,
    setSelectedOptions,
    clearList,
    showDescriptionInsertModal,
    setShowDescriptionInsertModal,
  } = useContext(GlobalContext);

  const [isDragging, setIsDragging] = useState(false);
  const dragItemRef = useRef(null);
  const [draggedId, setDraggedId] = useState(null);
  const [hours, setHours] = useState([]);

  const handleMouseDown = (event, hourId, minute) => {
    event.preventDefault();
    clearList();
    setIsDragging(true);
    setShowDescriptionInsertModal(false);
    console.log("TouchStart: " + hourId + "-" + minute);
    //setDraggedId(minute + "-" + hourId);
    dragItemRef.current = { hourId, minute };
  };

  const handleMouseMove = (event, hourId, minute) => {
    event.preventDefault();
    if (isDragging) {
      setDraggedId(minute + "-" + hourId);
      addToList(hourId + ":" + minute);
      console.log("Dragging over MouseMove:", hourId, minute);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragItemRef.current = null;
    //setDraggedId(null);
    selectedOptions[0] !== undefined &&
    selectedOptions.length > 1 &&
    (isLater() ? true : clearList())
      ? setShowDescriptionInsertModal(true)
      : setShowDescriptionInsertModal(false);
    console.log("dragging-mouseUp stopped");
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    dragItemRef.current = null;
    //setDraggedId(null);
    console.log("dragging-leaved stopped");
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

  /* Manage the selected list */
  const addToList = (option) => {
    if (!selectedOptions.includes(option)) {
      console.log("\nTOTAL SELECTED: " + selectedOptions);
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  /* We need to check if the start time is bigger than the finish time,
     because if the start time > than the finsih time we must not 
     allow the DescriptionInsertModal to appear */

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
  /* ----------------------------------------------------------------------------------- */

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className="h-screen w- w-screen fixed left-0 top-0 flex justify-center items-center">
      <form className="g-amber-50 rounded-lg shadow-2xl w-11/12
      max-w-full max-h-screen overflow-auto">
        <header
            className={"bg-gray-100 px-4 py-2 flex justify-between items-center"}
        >
          <p className="text-slate-700 font-black hover:text-sky-700">
            {daySelected.format("dddd, MMMM, DD")}
          </p>
          <div>
            <button
                onClick={() => {
                  setShowDescriptionInsertModal(false);
                  setShowInsertModal(false);
                  clearList();
                }}
            >
              <span
                  className={
                    "material-icons-outlined text-black-400 hover:bg-red-400 rounded-xl transition duration-500 ease-in-outs"
                  }
              >
                close
              </span>
            </button>
          </div>
        </header>

        <div className={`${showDescriptionInsertModal ? "flex" : ""}`}>
          <div
            className={`grid grid-cols-1 gap-4 bg-white ${
              showDescriptionInsertModal ? "w-3/6" : ""
            }`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="overflow-y-auto"
              style={{ maxHeight: "600px" }}
            >
              {hours.map((hour) => {
                return (
                  <React.Fragment key={hour.id}>
                    <div
                      id={"00-" + hour.id}
                      className={`border rounded-md p-2 ${
                        (draggedId === "00-" + hour.id && isDragging) ||
                        selectedOptions.includes(`${hour.id}:00`)
                          ? "bg-blue-400 transition duration-300 ease-in-outs"
                          : "NOT"
                      }`}
                      onMouseDown={(e) => handleMouseDown(e, hour.id, "00")}
                      onMouseMove={(e) => handleMouseMove(e, hour.id, "00")}
                      onMouseUp={handleMouseUp}
                      //onMouseLeave={handleMouseLeave}
                      onTouchStart={(e) => handleTouchStart(e, hour.id, "00")}
                      onTouchMove={(e) => handleTouchMove(e, hour.id, "00")}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchCancel}
                    >
                      <span className="text-slate-700 font-bold">
                        {hour.hour === 12 && hour.ampm === "PM" ? (
                          <>
                            <span
                              className="material-icons-outlined text-yellow-600 mr-1"
                              style={{ verticalAlign: "middle" }}
                            >
                              light_mode
                            </span>
                            {hour.hour}
                          </>
                        ) : hour.hour === 12 && hour.ampm === "AM" ? (
                          <>
                            <span
                              className="material-icons-outlined text-blue-600 mr-1"
                              style={{ verticalAlign: "middle" }}
                            >
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
                    {
                      <React.Fragment>
                        <div
                          className={`border rounded-md p-2 text-xs ${
                            (draggedId === "15-" + hour.id && isDragging) ||
                            selectedOptions.includes(`${hour.id}:15`)
                              ? "bg-blue-200 transition duration-300 ease-in-outs"
                              : "NOT"
                          }`}
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
                          className={`border rounded-md p-2 text-xs ${() =>
                            "w-3/6"} ${
                            (draggedId === "30-" + hour.id && isDragging) ||
                            selectedOptions.includes(`${hour.id}:30`)
                              ? "bg-blue-200"
                              : "NOT"
                          }`}
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
                          className={`border rounded-md p-2 text-xs ${() =>
                            "w-3/6"} ${
                            (draggedId === "45-" + hour.id && isDragging) ||
                            selectedOptions.includes(`${hour.id}:45`)
                              ? "bg-blue-200 transition duration-00 ease-in-outs"
                              : "NOT"
                          }`}
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
                    }
                  </React.Fragment>
                );
              })}
            </motion.div>
          </div>
          {showDescriptionInsertModal ? <DescriptionInsertModal /> : ""}
        </div>
      </form>
    </motion.div>
  );
}
