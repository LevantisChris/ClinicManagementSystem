import React, { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "../../../context/GlobalContext";
import {animate , motion} from 'framer-motion'
import UserService from "../../../services/UserService";
import {data} from "autoprefixer";
import LoadingApp from "../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/16/solid";
/*-*/

export default function DescriptionInsertModal({appointmentClicked}) {

  const componentRef = useRef(null);

  const {
    daySelected,
    selectedOptions,
    clearList,
    setShowDescriptionInsertModal,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    setReloadDoctorApp
  } = useContext(GlobalContext);

  /* States to access the filed values */
  // const [patientName, setPatientName] = useState('');
  // const [patientSurname, setPatientSurname] = useState('');
  const [patientAmka, setPatientAmka] = useState('');
  const [description, setDescription] = useState('');
  /* For loading screen and  */
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  /* To handle the state selection */
  const [stateSelected, setStateSelected] = useState(
      appointmentClicked !== null
          ? (
              appointmentClicked.appointmentStateId === 4
                  ? "Canceled"
                  : appointmentClicked.appointmentStateId === 2
                      ? "Respected"
                      : appointmentClicked.appointmentStateId === 3
                          ? "Completed"
                          : "Created"
          )
          : "Created"
  );

  /* In this function we will destruct from the selectedOption list
       the hours that the user has selected */
  function findTime() {
    const start =
      selectedOptions[0].charAt(0) === "0"
        ? "12" + selectedOptions[0].substring(1)
        : selectedOptions[0];

    const finish =
      selectedOptions[selectedOptions.length - 1].charAt(0) === "0"
        ? 12 + selectedOptions[selectedOptions.length - 1].substring(1)
        : selectedOptions[selectedOptions.length - 1];

    //console.log(`Time selected ${selectedOptions}`);

    return `${start} to ${finish}`;
  }

  const handleClickCancel = async () => {
    await animate(componentRef.current, { opacity: 0, transition: { duration: 0.75, ease: "easeOut" } });
    clearList();
    setShowDescriptionInsertModal(false);
  };

  /* Here we will take the values of the fields and send them as JSON in the backend */
  async function handleClickSave() {
      setLoading(true)
      // Extracting the start and end time
      const startTime = selectedOptions[0];
      const endTime = selectedOptions[selectedOptions.length - 1];

      /* Extract the Date from the State */
      const date = daySelected.format("YYYY-MM-DD");

      const formattedStartTime = convertTo24HourFormat(startTime);
      const formattedEndTime = convertTo24HourFormat(endTime);

      const formData = {
        appointmentPatientAMKA: patientAmka,
        appointmentDate: date,
        appointmentStartTime: formattedStartTime + ":00",
        appointmentEndTime: formattedEndTime + ":00",
        appointmentJustification: description,
        appointmentStateId: getStateId()
      };
        /* Send the request to the backend */
        const response = await UserService.createAppointment(formData)
        if (response.statusCode === 200) {
          setLoading(false)
          setShowDescriptionInsertModal(false);
          setSuccessMessage(response.message)
          setReloadDoctorApp(true);
        } else {
          setShowDescriptionInsertModal(false);
          setLoading(false)
          setErrorMessage(response.message)
        }
  }

  function getStateId() {
    if(stateSelected === "Created")
      return 1
    else if(stateSelected === "Respected")
      return 2
    else if(stateSelected === "Completed")
      return 3
    else
      return 4
  }

  async function handleClickUpdate() {
    setLoading(true)
    /* Create the data JSON response */
    const data = {
      appointmentId: appointmentClicked.appointmentId,
      appointmentDate: appointmentClicked.appointmentDate,
      appointmentStartTime: appointmentClicked.appointmentStartTime,
      appointmentEndTime: appointmentClicked.appointmentEndTime,
      appointmentStateId: getStateId()
    }
    const response = await UserService.updateAppointment(data)
    if (response.statusCode === 200) {
      setLoading(false)
      setShowDescriptionInsertModal(false);
      setSuccessMessage(response.message)
      setReloadDoctorApp(true);
    } else {
      setLoading(false)
      setShowDescriptionInsertModal(false);
      setErrorMessage(response.message)
    }
  }

  /* NOTE: THIS IS NOT DELETION OF THE APPOINTMENT, THIS IS JUST CANCELLATION.
  *  BUT THE APPOINTMENT WILL NOT BE SEEING IN THE CALENDAR VIEW, BECAUSE THE
  *  USER CAN OBVIOUSLY ADD A NEW ONE, IN THE SAME TIME.*/
  async function handleClickDelete() {
    setLoading(true)
    const data = {
      appointmentId: appointmentClicked.appointmentId
    }
    const response = await UserService.cancelAppointment(data)
    if (response.statusCode === 200) {
      setLoading(false)
      setShowDescriptionInsertModal(false);
      setReloadDoctorApp(true);
      setSuccessMessage(response.message)
    } else {
      setLoading(false)
      setShowDescriptionInsertModal(false);
      setErrorMessage(response.message)
    }
  }

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

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          ref={componentRef}
          className="w-6/12 bg-white shadow-2xl p-5"
      >
        {loading ? (
            <LoadingApp />
        ) : successMessage !== null ? (
            <SuccessApp />
        ) : errorMessage !== null ? (
            <ErrorApp />
        ) : (
            <div className="p-3">
              <div className="grid grid-cols-1/5 gap-y-7 items-center">
          <span className="text-center material-icons-outlined text-gray-400 text-5xl">
            schedule
          </span>
                <p className="text-4xl">
                  {daySelected.format("dddd MMMM DD")},{" "}
                  <React.Fragment>
              <span className="font-bold">
                {selectedOptions[0] !== undefined ? findTime() : ""}
              </span>
                  </React.Fragment>
                </p>

                <span className="text-center material-icons-outlined text-gray-400">
            person
          </span>
                {/*      <input*/}
                {/*          type="text"*/}
                {/*          name="patient_name"*/}
                {/*          placeholder="Patient name"*/}
                {/*          className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"*/}
                {/*          value={patientName}*/}
                {/*          onChange={(e) => setPatientName(e.target.value)}*/}
                {/*      />*/}

                {/*      <span className="text-center material-icons-outlined text-gray-400">*/}
                {/*  person*/}
                {/*</span>*/}
                {/*      <input*/}
                {/*          type="text"*/}
                {/*          name="patient_surname"*/}
                {/*          placeholder="Patient surname"*/}
                {/*          className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"*/}
                {/*          value={patientSurname}*/}
                {/*          onChange={(e) => setPatientSurname(e.target.value)}*/}
                {/*      />*/}

                {/*      <span className="text-center material-icons-outlined text-gray-400">*/}
                {/*  medical_information*/}
                {/*</span>*/}
                <input
                    type="text"
                    name="patient_amka"
                    placeholder="AMKA"
                    disabled={!!appointmentClicked}
                    className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    value={appointmentClicked ? appointmentClicked.appointmentPatientAMKA : patientAmka}
                    onChange={(e) => setPatientAmka(e.target.value)}
                />
                <span className="text-center material-icons-outlined text-gray-400">
            check_circle
          </span>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton
                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      Current State
                      <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400"/>
                    </MenuButton>
                  </div>
                  <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <a
                            href="#"
                            className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                            onClick={() => setStateSelected("Created")}
                        >
                          Created
                          { stateSelected === "Created" ?
                            <span className="material-icons-outlined text-gray-400">
                              check
                            </span> : ""
                          }
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                            href="#"
                            className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                            onClick={() => setStateSelected("Respected")}
                        >
                          Respected
                          { stateSelected === "Respected" ?
                              <span className="material-icons-outlined text-gray-400">
                              check
                            </span> : ""
                          }
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                            href="#"
                            className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                            onClick={() => setStateSelected("Completed")}
                        >
                          Completed
                          { stateSelected === "Completed" ?
                              <span className="material-icons-outlined text-gray-400">
                              check
                            </span> : ""
                          }
                        </a>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>

                <span className="text-center material-icons-outlined text-gray-400">
            description
          </span>
                <textarea
                    name="description"
                    placeholder="Reason for the appointment"
                    style={{height: "200px", resize: "none"}}
                    disabled={!!appointmentClicked}
                    className="pt-3 border-0 text-gray-600 bg-gray-200 pd-2 w-full border-b-2 rounded border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    value={appointmentClicked ? appointmentClicked.appointmentJustification : description}
                    onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex mt-5 gap-5">
                {/* This button will be for the cancellation of an appointment
                    the appointment will not be deleted from the DB, but the user can not see it
                    in the calendar View.*/}
                {
                  appointmentClicked ?
                      <button
                          type="button"
                          onClick={handleClickDelete}
                          className="bg-red-500 w-2/4 hover:bg-blue-600 px-6 py-2 transition duration-500 ease-in-outs rounded text-white"
                      >
                        Cancel appointment
                      </button>
                      : ""
                }

                {
                  appointmentClicked ?
                      <button
                          type="button"
                          onClick={handleClickUpdate}
                          className="bg-purple-500 w-2/4 hover:bg-blue-600 px-6 py-2 transition duration-500 ease-in-outs rounded text-white"
                      >
                        Update state
                      </button>
                      :
                      <button
                          type="button"
                          onClick={handleClickSave}
                          className="bg-blue-500 w-2/4 hover:bg-blue-600 px-6 py-2 transition duration-500 ease-in-outs rounded text-white"
                      >
                        Save
                      </button>
                }
                <button
                    type="button"
                    onClick={handleClickCancel}
                    className="bg-red-500 w-2/4 hover:bg-red-600 px-6 py-2 ml-2 transition duration-500 ease-in-outs rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
        )}
      </motion.div>
  );
}
