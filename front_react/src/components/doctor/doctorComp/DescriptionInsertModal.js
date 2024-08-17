import React, { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "../../../context/GlobalContext";
import {animate , motion} from 'framer-motion'
/*-*/

export default function DescriptionInsertModal({ props }) {

  const componentRef = useRef(null);

  const {
    daySelected,
    selectedOptions,
    clearList,
    setShowDescriptionInsertModal,
  } = useContext(GlobalContext);

  /* States to access the filed values */
  const [patientName, setPatientName] = useState('');
  const [patientSurname, setPatientSurname] = useState('');
  const [patientAmka, setPatientAmka] = useState('');
  const [description, setDescription] = useState('');

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
  function handleClickSave() {
    const formData = {
      patient_name: patientName,
      patient_surname: patientSurname,
      patient_amka: patientAmka,
      description,
    };
    console.log('Saving data:', formData);
  }

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          ref={componentRef}
          className="w-6/12 bg-white shadow-2xl p-5"
      >
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
            <input
                type="text"
                name="patient_name"
                placeholder="Patient name"
                className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                // Step 3: Update state on change
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
            />

            <span className="text-center material-icons-outlined text-gray-400">
            person
          </span>
            <input
                type="text"
                name="patient_surname"
                placeholder="Patient surname"
                className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                // Step 3: Update state on change
                value={patientSurname}
                onChange={(e) => setPatientSurname(e.target.value)}
            />

            <span className="text-center material-icons-outlined text-gray-400">
            medical_information
          </span>
            <input
                type="text"
                name="patient_amka"
                placeholder="AMKA"
                className="pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                // Step 3: Update state on change
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
                // Step 3: Update state on change
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
      </motion.div>
  );
}
