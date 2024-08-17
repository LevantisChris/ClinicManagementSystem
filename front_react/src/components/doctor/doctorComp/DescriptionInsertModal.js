import React, { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "../../../context/GlobalContext";
import {animate , motion} from 'framer-motion'
import UserService from "../../../services/UserService";
import {data} from "autoprefixer";
import LoadingApp from "../../Loading/LoadingApp";
import SuccessApp from "../../Success/SuccessApp";
import ErrorApp from "../../Error/ErrorApp";
/*-*/

export default function DescriptionInsertModal({ props }) {

  const componentRef = useRef(null);

  const {
    daySelected,
    selectedOptions,
    clearList,
    setShowDescriptionInsertModal,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useContext(GlobalContext);

  /* States to access the filed values */
  const [patientName, setPatientName] = useState('');
  const [patientSurname, setPatientSurname] = useState('');
  const [patientAmka, setPatientAmka] = useState('');
  const [description, setDescription] = useState('');
  /* For loading screen and  */
  const [loading, setLoading] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    console.log(`Time selected ${selectedOptions}`);

    return `${start} to ${finish}`;
  }

  const handleClickCancel = async () => {
    await animate(componentRef.current, { opacity: 0, transition: { duration: 0.75, ease: "easeOut" } });
    clearList();
    setShowDescriptionInsertModal(false);
  };

  /* Here we will take the values of the fields and send them as JSON in the backend */
  async function handleClickSave() {
    const formData = {
      patient_name: patientName,
      patient_surname: patientSurname,
      patient_amka: patientAmka,
      description,
    };

    // Extracting the start and end time
    const startTime = selectedOptions[0];
    const endTime = selectedOptions[selectedOptions.length - 1];

    /* Extract the Date from the State */
    const date = daySelected.format("YYYY-MM-DD");

    const formattedStartTime = convertTo24HourFormat(startTime);
    const formattedEndTime = convertTo24HourFormat(endTime);

    console.log("Formatted Start Time: ", formattedStartTime);
    console.log("Formatted End Time: ", formattedEndTime);
    console.log("Date selected: " + date)


    /* Send the request to the backend */
    const response = await UserService.createAppointment(data)
    if (response.statusCode === 200) {
      setLoading(false)
      setShowSubmitDialog(false);
      setSuccessMessage(response.message)
    } else {
      setErrorMessage(response.message)
    }

  }

  function formatDateToLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
                {selectedOptions[0] !== undefined ? findTime() : console.log("EMPTY")}
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
                    className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    value={patientAmka}
                    onChange={(e) => setPatientAmka(e.target.value)}
                />

                <span className="text-center material-icons-outlined text-gray-400">
            description
          </span>
                <textarea
                    name="description"
                    placeholder="Reason for the appointment"
                    style={{ height: "200px", resize: "none" }}
                    className="pt-3 border-0 text-gray-600 bg-gray-200 pd-2 w-full border-b-2 rounded border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <span className="text-center material-icons-outlined text-gray-400">
            check_circle
          </span>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">
                  Status
                </button>
              </div>

              <div className="flex mt-5">
                <button
                    type="button"
                    onClick={handleClickSave}
                    className="bg-blue-500 w-2/4 hover:bg-blue-600 px-6 py-2 transition duration-500 ease-in-outs rounded text-white"
                >
                  Save
                </button>
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
