import React, { useEffect, useMemo, useReducer, useState } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

/* We use the switch to manage different events */
function savedEventsReduser(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((event) => (event.id === payload.id ? payload : event));
    case "delete":
      return state.filter(
        (event) => event.id !== payload.id
      ); /* return all the events that are different from the payload */
    default:
      throw new Error();
  }
}

function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedEvents, dispatchCallEvent] = useReducer(
    savedEventsReduser,
    [],
    initEvents
  );
  const [labels, setLabels] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(
    []
  ); /* This is to remember the selected hours */
  const [showDescriptionInsertModal, setShowDescriptionInsertModal] =
    useState(false); /* This state is to know when to show the modal that the user will add the info for an event after the selection of the hours */

  const [showActiveHoursModal, setShowActiveHoursModal] =
    useState(false); /* This state is for the Active Hours Modal, to know when to show it */

   const [showSearchAppointments, setShowSearchAppointments]
    = useState(false); /* This is for the switching between the Calendar (Month) and the view for the Search Appointments */

    const [showRegisterPatient, setShowRegisterPatient]
        = useState(false)

    const [showSearchPatients, setShowSearchPatients]
        = useState(false)

    const [showRegisterPatientMassively, setShowRegisterPatientMassively]
        = useState(false)

    const [userAuthed, setUserAuthed]
        = useState(null) /* The details of the user that has been authenticated */

    const [successMessage, setSuccessMessage]
        = useState(null)

    const [errorMessage, setErrorMessage]
        = useState(null)

    const [reloadDoctorApp, setReloadDoctorApp]
        = useState(false)


    const [viewDisplayAppointmentComponent, setViewDisplayAppointmentComponent]
        = useState(false)

    const [viewDisplayPatientComponent, setViewDisplayPatientComponent]
        = useState(false)

    const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  /* This function is to clear the selectedOptions list, we define 
       it here because we want all the classes to have access on it */
  const clearList = () => {
    console.log("The list has been emptied");
    setSelectedOptions([]);
  };

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  /* To fix the bug with the modals
   *  Everytime we close a modal we are going to clean the Modal */
  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);

  function updateLabel(label) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,

        showEventModal,
        setShowEventModal,

        showInsertModal,
        setShowInsertModal,

        showDescriptionInsertModal,
        setShowDescriptionInsertModal,

        showActiveHoursModal,
        setShowActiveHoursModal,

        showSearchAppointments,
        setShowSearchAppointments,

        showRegisterPatient,
        setShowRegisterPatient,

        showSearchPatients,
        setShowSearchPatients,

        userAuthed,
        setUserAuthed,

        successMessage,
        setSuccessMessage,

        errorMessage,
        setErrorMessage,

        viewDisplayAppointmentComponent,
        setViewDisplayAppointmentComponent,

        viewDisplayPatientComponent,
        setViewDisplayPatientComponent,

        showRegisterPatientMassively,
        setShowRegisterPatientMassively,

        reloadDoctorApp,
        setReloadDoctorApp,

        selectedOptions,
        setSelectedOptions,
        clearList,

        dispatchCallEvent,
        savedEvents,
        selectedEvent,
        setSelectedEvent,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
