import React, { useContext, useRef, useState } from "react";
import GlobalContext from "../../../context/GlobalContext";
import {animate , motion} from 'framer-motion'
import UserService from "../../../services/UserService";
import LoadingApp from "../../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";
/*-*/

export default function DescriptionInsertModal({appointmentClicked, doctorAppointmentClicked}) {

  const componentRef = useRef(null);

  const {
    userAuthedDetails,
    daySelected,
    selectedOptions,
    clearList,
    setShowDescriptionInsertModal,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    setReloadDoctorApp,
    viewEnglish
  } = useContext(GlobalContext);

  /* States to access the filed values */
  // const [patientName, setPatientName] = useState('');
  // const [patientSurname, setPatientSurname] = useState('');
  const [patientAmka, setPatientAmka] = useState(userAuthedDetails.patient_AMKA);
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

    return `${start} ${viewEnglish ? "to" : "εώς"} ${finish}`;
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
        appointmentStateId: getStateId(),
        appointmentDoctorEmail: doctorAppointmentClicked[2]
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

  function getGreekDate(date) {
    return getGreekDay(date.format("dddd")) + " " + getGreekMonth(date.format("MMMM")) + " " + date.format("DD")
  }

  function getGreekMonth(formattedDate) {
    if(formattedDate === "September") {
      return "Σεπτέμβριος "
    } else if(formattedDate === "October") {
      return "Οκτώβριος "
    } else if(formattedDate === "November") {
      return "Νοεμβριος "
    } else if(formattedDate === "December") {
      return "Δεκέμβριος "
    } else if(formattedDate === "January") {
      return "Ιανουάριος "
    } else if(formattedDate === "February") {
      return "Φεβρουάριος "
    } else if(formattedDate === "March") {
      return "Μαρτιος "
    } else if(formattedDate === "April") {
      return "Απρίλιος "
    } else if(formattedDate === "May") {
      return "Μάιος "
    } else if(formattedDate === "June") {
      return "Ιούνιος "
    } else if(formattedDate === "July") {
      return "Ιούλιος "
    } else if(formattedDate === "August") {
      return "Άυγουστος "
    }
    return "Greek Date";
  }

  function getGreekDay(formattedDay) {
    const greekDays = {
      "Monday": "Δευτέρα",
      "Tuesday": "Τρίτη",
      "Wednesday": "Τετάρτη",
      "Thursday": "Πέμπτη",
      "Friday": "Παρασκευή",
      "Saturday": "Σάββατο",
      "Sunday": "Κυριακή"
    };

    return greekDays[formattedDay] || "Greek Day";
  }


  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          ref={componentRef}
          className="w-full sm:w-6/12 bg-white shadow-2xl p-5 z-50"
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
                <span className="text-center material-icons-outlined text-gray-400 text-3xl sm:text-5xl">
                  schedule
                </span>
                <p className="text-xl sm:text-4xl">
                  {viewEnglish ? daySelected.format("dddd MMMM DD") : getGreekDate(daySelected)}{" "}
                  <React.Fragment>
                  <span className="font-bold">
                    {selectedOptions[0] !== undefined ? findTime() : ""}
                  </span>
                  </React.Fragment>
                </p>

                <span className="text-center material-icons-outlined text-gray-400">
                  person
                </span>
                <input
                    type="text"
                    name="patient_name"
                    placeholder="Patient name"
                    disabled={true}
                    className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    value={userAuthedDetails.user.user_name}
                />

                <span className="text-center material-icons-outlined text-gray-400">
                  person
                </span>
                <input
                    type="text"
                    name="patient_surname"
                    placeholder="Patient surname"
                    disabled={true}
                    className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    value={userAuthedDetails.user.user_surname}
                />

                <span className="text-center material-icons-outlined text-gray-400">
                  fingerprint
                </span>
                <input
                    type="text"
                    name="patient_idNumber"
                    placeholder="Patient ID Number"
                    disabled={true}
                    className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    value={userAuthedDetails.user.user_idNumber}
                />

                <span className="text-center material-icons-outlined text-gray-400">
                  medical_information
                </span>
                <input
                    type="text"
                    name="patient_amka"
                    placeholder="AMKA"
                    disabled={true}
                    className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    value={appointmentClicked ? appointmentClicked.appointmentPatientAMKA : patientAmka}
                    onChange={(e) => setPatientAmka(e.target.value)}
                />

                <span className="text-center material-icons-outlined text-gray-400">
                  medical_information
                </span>
                <input
                    type="text"
                    name="doctro_email"
                    placeholder="Doctor Email"
                    disabled={true}
                    className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    value={appointmentClicked ? appointmentClicked.appointmentDoctorEmail : doctorAppointmentClicked[2]}
                    onChange={(e) => setPatientAmka(e.target.value)}
                />

                <span className="text-center material-icons-outlined text-gray-400">
                  description
                </span>
                <textarea
                    name="description"
                    placeholder={viewEnglish ? "Reason for the appointment" : "Λόγος ραντεβού"}
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
                        {viewEnglish ? "Cancel appointment" : "Ακύρωση ραντεβού"}
                      </button>
                      : ""
                }

                {
                  appointmentClicked ?
                      ""
                      :
                      <button
                          type="button"
                          onClick={handleClickSave}
                          className="bg-blue-500 w-2/4 hover:bg-blue-600 px-6 py-2 transition duration-500 ease-in-outs rounded text-white"
                      >
                        {viewEnglish ? "Save" : "Αποθήκευση"}
                      </button>
                }
                <button
                    type="button"
                    onClick={handleClickCancel}
                    className="bg-red-500 w-2/4 hover:bg-red-600 px-6 py-2 ml-2 transition duration-500 ease-in-outs rounded text-white"
                >
                  {viewEnglish ? "Cancel" : "Ακύρωση"}
                </button>
              </div>
            </div>
        )}
      </motion.div>
  );
}
