import React, { useContext, useState, useRef } from "react";
import GlobalContext from "../../../context/GlobalContext";
import DescriptionInsertModal from "./DescriptionInsertModal";
import { motion } from "framer-motion";
import UserService from "../../../services/UserService";
import LoadingApp from "../../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/16/solid";

/* The modal that helps the user pick time slots */

export default function InsertModal() {
  const {
    showInsertModal,
    setShowInsertModal,
    daySelected,
    selectedOptions,
    setSelectedOptions,
    clearList,
    showDescriptionInsertModal,
    setShowDescriptionInsertModal,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
      viewEnglish
  } = useContext(GlobalContext);

  const [isDragging, setIsDragging] = useState(false);
  const dragItemRef = useRef(null);
  const [draggedId, setDraggedId] = useState(null);
  const [hours, setHours] = useState([]);

  /* The working hours that are already defined (if there are any, might be null) */
  const [workingHours, setWorkingHours] = useState([]);
  const [doctroWorkingHours, setDoctorWorkingHours] = useState([]);
  /* Thea appointments for the logged in doctor, for the day he/she selects */
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(false)

  const [appointClicked, setAppointClicked] = useState(null)

  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [whDoctorView, setWhDoctorView]
      = useState([null, null]);

  const am_str = "AM";
  const pm_str =  "PM";

  const handleMouseDown = (event, hourId, minute) => {
    event.preventDefault();
    clearList();
    setIsDragging(true);
    setShowDescriptionInsertModal(false);
    //console.log("TouchStart: " + hourId + "-" + minute);
    //setDraggedId(minute + "-" + hourId);
    dragItemRef.current = { hourId, minute };
  };

  const handleMouseMove = (event, hourId, minute) => {
    event.preventDefault();
    if (isDragging) {
      setAppointClicked(null)
      /* We have to check wheaten that hour the user
            *  select is already selected.
            *  If its already selected then
            *  send request to the server to delete it.
            *  */
      const temp1 = checkDateSimilarity_WH(
          daySelected.format("YYYY-MM-DD"),
          (hourId >= 0 && hourId <= 10 ? "0" + hourId : hourId) + ":" + minute + ":00")
      const temp2 = checkDateSimilarity_APP(
          (hourId >= 0 && hourId <= 10 ? "0" + hourId : hourId) + ":" + minute + ":00")
      if (temp1 === null || temp2 !== null) {
        setIsDragging(false);
        dragItemRef.current = null;
      } else {
        setDraggedId(minute + "-" + hourId);
        addToList(hourId + ":" + minute);
        //console.log("Dragging over MouseMove:", hourId, minute);
      }
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
    //console.log("dragging-mouseUp stopped");
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    dragItemRef.current = null;
    //setDraggedId(null);
    //console.log("dragging-leaved stopped");
  };

  const handleTouchStart = (event, hourId, minute) => {
    event.preventDefault();
    setIsDragging(true);
    //console.log("TouchStart: " + hourId + "-" + minute);
    //setDraggedId(minute + "-" + hourId);
    dragItemRef.current = { hourId, minute };
  };

  const handleTouchMove = (event, hourId, minute) => {
    // Handle the touch end logic, similar to mouse up
    const touch = event.changedTouches[0]; // Gets the first touch point that was lifted
    const { clientX, clientY } = touch; // Coordinates where the touch ended

    // Block the overflow
    document.body.style.overflow = 'hidden';

    // Optionally, after some condition or timeout, re-enable the overflow
    setTimeout(() => {
      document.body.style.overflow = 'auto'; // Or restore it based on your needs
    }, 1000); // Change the timeout as necessary


    event.preventDefault();
    if (isDragging) {
      setAppointClicked(null)
      /* We have to check wheaten that hour the user
            *  select is already selected.
            *  If its already selected then
            *  send request to the server to delete it.
            *  */
      const temp1 = checkDateSimilarity_WH(
          daySelected.format("YYYY-MM-DD"),
          (hourId >= 0 && hourId <= 10 ? "0" + hourId : hourId) + ":" + minute + ":00")
      const temp2 = checkDateSimilarity_APP(
          (hourId >= 0 && hourId <= 10 ? "0" + hourId : hourId) + ":" + minute + ":00")
      if (temp1 === null || temp2 !== null) {
        setIsDragging(false);
        dragItemRef.current = null;
      } else {
        setDraggedId(minute + "-" + hourId);
        addToList(hourId + ":" + minute);
        //console.log("Dragging over MouseMove:", hourId, minute);
      }
    }
  };

  const handleTouchEnd = (e) => {
    // Handle the touch end logic, similar to mouse up
    const touch = e.changedTouches[0]; // Gets the first touch point that was lifted
    const { clientX, clientY } = touch; // Coordinates where the touch ended

    // Block the overflow
    document.body.style.overflow = 'hidden';

    // Optionally, after some condition or timeout, re-enable the overflow
    setTimeout(() => {
      document.body.style.overflow = 'auto'; // Or restore it based on your needs
    }, 1000); // Change the timeout as necessary


    setIsDragging(false);
    dragItemRef.current = null;
    //setDraggedId(null);
    selectedOptions[0] !== undefined &&
    selectedOptions.length > 1 &&
    (isLater() ? true : clearList())
        ? setShowDescriptionInsertModal(true)
        : setShowDescriptionInsertModal(false);
    //console.log("dragging-mouseUp stopped");
  };

  const handleTouchCancel = () => {
    setIsDragging(false);
    dragItemRef.current = null;
    //setDraggedId(null);
    //console.log("dragging-touchCancel stopped");
  };

  /* Manage the selected list */
  const addToList = (option) => {
    if (!selectedOptions.includes(option)) {
      //console.log("\nTOTAL SELECTED: " + selectedOptions);
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  function handleHourClick(hourClicked) {
    /* Now we have to check whether the hour he clicks in is about an appointment */
    const appoint = checkDateSimilarity_APP(hourClicked);
    if(appoint) {
      setAppointClicked(appoint)
      setShowDescriptionInsertModal(true)
    }
  }

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
      const firstTotalMinutes = firstHours * 60 + firstMinutes;
      const secondTotalMinutes = secondHours * 60 + secondMinutes;
      return firstTotalMinutes < secondTotalMinutes;
    }
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

  /* Get available doctors from the WH */
  function getAvailableDoctors(whList) {
    const availableDoctors_temp = new Set(); // A set to store doctor user_idNumbers
    const doctorList = []; // The list of unique doctors
    for (const wh of whList) {
      const doctorId = wh.doctor.user.user_idNumber;
      // Check if the doctor is not already in the set
      if (!availableDoctors_temp.has(doctorId)) {
        availableDoctors_temp.add(doctorId);
        doctorList.push(wh.doctor);
      }
    }
    setAvailableDoctors(doctorList) // Return the list of unique doctors
  }


  React.useEffect(() => {
    const loadWorkingHours = async () => {
      //setLoading(true)
      const token = localStorage.getItem('token');
      if(token) {
        try {
          const w_hours = await UserService.getWorkingHoursOfADoctor(token);
          if(w_hours[0].statusCode !== 404) {
            setWorkingHours(w_hours[0].whList);
            /* Now based on the wh retrieved get available doctors */
            getAvailableDoctors(w_hours[0].whList);
            setLoading(false)
          }
        } catch (error) {
          console.error('Failed to fetch working hours:', error);
          setLoading(false)
        }
      }
    }
    loadWorkingHours();
  }, []);

  React.useEffect(() => {
    const loadAppointments = async () => {
      const params = {
        patientId: 0 // because we use the token
      };
      try {
        //setLoading(true); // Set loading to true when starting to fetch data
        const response = await UserService.getPatientAppointments(params);
        if (response.statusCode === 200) {
          setAppointments(response.appointmentList);
        }
      } catch (error) {
        console.log("Error to fetch appointments for the patient: ", error);
      } finally {
        setLoading(false); // Ensure loading is set to false regardless of success or failure
      }
    };
    loadAppointments();
  }, [appointments.length, showDescriptionInsertModal]);

  /* If there are any already predefined working hours we have to display them to the user
   * In this function we will try to match them, in order to know which of them to "underline" */
  function checkDateSimilarity_WH(calendarDate, calendarTime) {
    if (workingHours != null) {
      const formattedDate = daySelected.format("YYYY-MM-DD")  // Local date formatting
      for (const workingHour of doctroWorkingHours) {
        if (isTimeInRange(calendarTime, workingHour.startTime, workingHour.endTime) && formattedDate === workingHour.date) {
          return [workingHour.startTime, workingHour.endTime];
        }
      }
    }
    return null;
  }

  /* The same with the checkDateSimilarity_WH but for appointments */
  function checkDateSimilarity_APP(calendarTime) {
    if (appointments != null) {
      const formattedDate = daySelected.format("YYYY-MM-DD")  // Local date formatting
      for (const appointment of appointments) {
        if (
            isTimeInRange(calendarTime, appointment.appointmentStartTime, appointment.appointmentEndTime)
            && formattedDate === appointment.appointmentDate
            && appointment.appointmentStateId !== 4) {
          return appointment;
        }
      }
    }
    return null;
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

  function updateWHView(param) {
    const tempList = [];
    for(const wh of workingHours) {
        if(param[0] === wh.doctor.user.user_name && param[1] === wh.doctor.user.user_surname) {
          tempList.push(wh)
        }
    }
    setDoctorWorkingHours(tempList)
  }

  function setDoctorWH(doctorName, doctorSurname) {
    setWhDoctorView([doctorName, doctorSurname])
    updateWHView([doctorName, doctorSurname])
  }

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="h-screen w-screen fixed flex justify-center items-center z-50"
      >
        {loading ? (
            <LoadingApp />
        ) : successMessage !== null ? (
            <SuccessApp />
        ) : errorMessage !== null ? (
            <ErrorApp />
        ) : (
            <form className="bg-amber-50 rounded-lg shadow-2xl w-11/12 max-w-full max-h-screen overflow-auto">
              <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
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
              <span className="material-icons-outlined text-black-400 hover:bg-red-400 rounded-xl transition duration-500 ease-in-out">
                close
              </span>
                  </button>
                </div>
              </header>

              <div className={showDescriptionInsertModal ? "flex sm:flex-row flex-col" : ""}>
                <div
                    className={`grid grid-cols-1 gap-4 bg-white ${showDescriptionInsertModal ? "w-full sm:w-3/6" : ""}`}
                >


                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <MenuButton
                          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {(viewEnglish ? "Select Doctor" : "Επιλέξτε Γιατρό")}
                        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400"/>
                      </MenuButton>
                    </div>
                    <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <div className="py-1">
                        {availableDoctors.length !== 0 ? availableDoctors.map((doctor, index) => (
                            <MenuItem key={doctor.user.user_name + " " + doctor.user.user_surname}>
                              <a
                                  className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                  onClick={() => setDoctorWH(doctor.user.user_name, doctor.user.user_surname)}
                              >
                                {doctor.user.user_name}{" "}{doctor.user.user_surname}
                                { whDoctorView[0] === doctor.user.user_name && whDoctorView[1] === doctor.user.user_surname ?
                                    <span className="material-icons-outlined text-gray-400">
                                      check
                                    </span> : ""
                                }
                              </a>
                            </MenuItem>
                        )) : ""}
                      </div>
                    </MenuItems>
                  </Menu>



                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.75, ease: "easeOut" }}
                      className="overflow-y-auto"
                      style={{ maxHeight: "600px" }}
                  >
                    {hours.map((hour) => (
                        <React.Fragment key={hour.id}>
                          <div
                              id={`00-${hour.id}`}
                              className={`border rounded-md p-2 ${
                                  checkDateSimilarity_APP(
                                      `${hour.id >= 0 && hour.id <= 10 ? `0${hour.id}` : hour.id}:00:00`
                                  )
                                      ? "bg-amber-300"
                                      : checkDateSimilarity_WH(
                                          daySelected.toISOString().split('T')[0],
                                          `${hour.id >= 0 && hour.id <= 10 ? `0${hour.id}` : hour.id}:00:00`
                                      )
                                          ? draggedId === `00-${hour.id}` && isDragging || selectedOptions.includes(`${hour.id}:00`)
                                              ? "bg-blue-400 transition duration-300 ease-in-out"
                                              : "NOT"
                                          : "bg-slate-300"
                              }`}
                              onMouseDown={(e) => handleMouseDown(e, hour.id, "00")}
                              onMouseMove={(e) => handleMouseMove(e, hour.id, "00")}
                              onMouseUp={handleMouseUp}
                              onTouchStart={(e) => handleTouchStart(e, hour.id, "00")}
                              onTouchMove={(e) => handleTouchMove(e, hour.id, "00")}
                              onTouchEnd={(e) => handleTouchEnd}
                              onTouchCancel={handleTouchCancel}
                              onClick={() => handleHourClick(
                                  `${hour.id >= 0 && hour.id <= 10 ? `0${hour.id}` : hour.id}:00:00`
                              )}
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

                          <div
                              id={`15-${hour.id}`}
                              className={`border rounded-md p-2 text-xs 
                                                ${
                                  checkDateSimilarity_APP((hour.id >= 0 && hour.id <= 10 ? "0" + hour.id : hour.id) + ":15" + ":00")
                                      ? "bg-amber-300" :
                                      checkDateSimilarity_WH(daySelected.toISOString().split('T')[0], (hour.id >= 0 && hour.id <= 10 ? "0" + hour.id : hour.id) + ":15" + ":00") 
                                          ? ((draggedId === "15-" + hour.id && isDragging) ||
                                              selectedOptions.includes(`${hour.id}:15`)
                                              ? "bg-blue-200 transition duration-300 ease-in-outs"
                                              : "NOT")
                                          : "bg-slate-300"
                              }`
                              }
                              onMouseDown={(e) => handleMouseDown(e, hour.id, 15)}
                              onMouseMove={(e) => handleMouseMove(e, hour.id, 15)}
                              onMouseUp={handleMouseUp}
                              onTouchStart={(e) => handleTouchStart(e, hour.id, 15)}
                              onTouchMove={(e) => handleTouchMove(e, hour.id, 15)}
                              onTouchEnd={(e) => handleTouchEnd}
                              onTouchCancel={handleTouchCancel}
                              onClick={() => handleHourClick(
                                  (hour.id >= 0 && hour.id <= 10 ? "0" + hour.id : hour.id) + ":15" + ":00"
                              )}
                          >
                            {hour.hour}:15
                          </div>

                          <div
                              id={`30-${hour.id}`}
                              className={`border rounded-md p-2 text-xs 
                                                    ${() => "w-3/6"} 
                                                        ${
                                  checkDateSimilarity_APP((hour.id >= 0 && hour.id <= 10 ? "0" + hour.id : hour.id) + ":30" + ":00")
                                      ? "bg-amber-300" :
                                      checkDateSimilarity_WH(daySelected.toISOString().split('T')[0], (hour.id >= 0 && hour.id <= 10 ? "0" + hour.id : hour.id) + ":30" + ":00") 
                                      ? ((draggedId === "30-" + hour.id && isDragging) ||
                                            selectedOptions.includes(`${hour.id}:30`)
                                            ? "bg-blue-200"
                                            : "NOT")
                                          : "bg-slate-300"
                              }`
                              }
                              onMouseDown={(e) => handleMouseDown(e, hour.id, 30)}
                              onMouseMove={(e) => handleMouseMove(e, hour.id, 30)}
                              onMouseUp={handleMouseUp}
                              onTouchStart={(e) => handleTouchStart(e, hour.id, 30)}
                              onTouchMove={(e) => handleTouchMove(e, hour.id, 30)}
                              onTouchEnd={(e) => handleTouchEnd}
                              onTouchCancel={handleTouchCancel}
                              onClick={() => handleHourClick(
                                  (hour.id >= 0 && hour.id <= 10 ? "0" + hour.id : hour.id) + ":30" + ":00"
                              )}
                          >
                            {hour.hour}:30
                          </div>

                          <div
                              id={`45-${hour.id}`}
                              className={`border rounded-md p-2 text-xs 
                                                    ${() => "w-3/6"} 
                                                        ${
                                  checkDateSimilarity_APP((hour.id >= 0 && hour.id <= 10 ? "0" + hour.id : hour.id) + ":45" + ":00")
                                      ? "bg-amber-300" :
                                      checkDateSimilarity_WH(daySelected.toISOString().split('T')[0], (hour.id >= 0 && hour.id <= 10 ? "0" + hour.id : hour.id) + ":45" + ":00") 
                                          ? ((draggedId === "45-" + hour.id && isDragging) ||
                                              selectedOptions.includes(`${hour.id}:45`)
                                              ? "bg-blue-200 transition duration-00 ease-in-outs"
                                              : "NOT")
                                      : "bg-slate-300"
                              }`
                              }
                              onMouseDown={(e) => handleMouseDown(e, hour.id, 45)}
                              onMouseMove={(e) => handleMouseMove(e, hour.id, 45)}
                              onMouseUp={handleMouseUp}
                              onTouchStart={(e) => handleTouchStart(e, hour.id, 45)}
                              onTouchMove={(e) => handleTouchMove(e, hour.id, 45)}
                              onTouchEnd={(e) => handleTouchEnd}
                              onTouchCancel={handleTouchCancel}
                              onClick={() => handleHourClick(
                                  (hour.id >= 0 && hour.id <= 10 ? `0${hour.id}` : hour.id) + ":45:00"
                              )}
                          >
                            {hour.hour}:45
                          </div>
                        </React.Fragment>
                      ))
                    }
                  </motion.div>
                </div>
                {showDescriptionInsertModal && <DescriptionInsertModal appointmentClicked={appointClicked} />}
              </div>
            </form>
        )}
      </motion.div>
  );
}
