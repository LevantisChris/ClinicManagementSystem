import React, { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import {animate , motion} from 'framer-motion'

export default function DescriptionInsertModal({ props }) {

  const componentRef = useRef(null);

  const {
    daySelected,
    selectedOptions,
    clearList,
    setShowDescriptionInsertModal,
  } = useContext(GlobalContext);

  /* In this function we will desctruct from the selectedOption list
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}

      ref={componentRef}
      className="w-6/12 bg-white shadow-2xl p-5"
    >
      <div className={"p-3"}>
        <div className={"grid grid-cols-1/5 gap-y-7 items-center"}>
          <div></div>
          <input
            type={"text"}
            name={"title"}
            placeholder={"Add title"}
            className={
              "pt-3 border-0 text-gray-600 text-xl font-semibold pd-2 w-full border-b-2 border-gray-200 focus: outline-none focus:ring-0 focus:border-blue-500"
            }
          />
          <span className={"text-center material-icons-outlined text-gray-400"}>
            schedule
          </span>
          <p>
            {daySelected.format("dddd MMMM DD")},{" "}
            <React.Fragment>
              <span className={"font-bold"}>{selectedOptions[0] !== undefined ? findTime() : console.log("EMPTY")}</span>
            </React.Fragment>
          </p>

          <span class="text-center material-icons-outlined text-gray-400">
            pin_drop
          </span>
          <input
            type={"text"}
            name={"location"}
            placeholder={"Add the location"}
            className={
              "pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus: outline-none focus:ring-0 focus:border-blue-500"
            }
          />
          <span class="text-center material-icons-outlined text-gray-400">
            group_add
          </span>
          <input
            type={"text"}
            name={"invited_guests"}
            placeholder={"Invited guests"}
            className={
              "pt-3 border-0 text-gray-600 pd-2 w-full border-b-2 border-gray-200 focus: outline-none focus:ring-0 focus:border-blue-500"
            }
          />
          <span className={"text-center material-icons-outlined text-gray-400"}>
            segment
          </span>
          <textarea
            name={"description"}
            placeholder={"Add a description"}
            style={{ height: "200px", resize: "none" }} // Adjust the height as per your requirement
            className={
              "pt-3 border-0 text-gray-600 bg-gray-200 pd-2 w-full border-b-2 rounded border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
            }
          />
        </div>
        <div className="flex mt-5">
          <button
            type="button"
            className={
              "bg-blue-500 w-2/4 hover:bg-blue-600 px-6 py-2 transition duration-500 ease-in-outs rounded text-white"
            }
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleClickCancel}
            className={
              "bg-red-500 w-2/4 hover:bg-red-600 px-6 py-2 ml-2 transition duration-500 ease-in-outs rounded text-white"
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
