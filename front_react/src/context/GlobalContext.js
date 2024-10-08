import React from "react";

const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: (index) => {},
    smallCalendarMonth: 0,
    setSmallCalendarMonth: (index) => {},
    daySelected: null,
    setDaySelected: (day) => {},

    /* User Global values */
    userAuthedDetails: null,
    setUserAuthedDetails: () => {},

    showEventModal: false,
    setShowEventModal: () => {},

    showInsertModal: false,
    setShowInsertModal: () => {},

    showDescriptionInsertModal: false,
    setShowDescriptionInsertModal: () => {},

    showActiveHoursModal: false,
    setShowActiveHoursModal: () => {},

    showSearchAppointments: false,
    setShowSearchAppointments: () => {},

    showSearchPatients: false,
    setShowSearchPatients: () => {},

    showRegisterPatientMassively: false,
    setShowRegisterPatientMassively: () => {},

    showRegisterPatient: false,
    setShowRegisterPatient: () => {},

    showCreateHistoryReg: false,
    setShowCreateHistoryReg: () => {},

    showDisplayAllHistory: false,
    setShowDisplayAllHistory: () => {},

    showRegisterPatientHistoryMassively: false,
    setShowRegisterPatientHistoryMassively: () => {},

    patientHistoryToSee: null,
    setPatientHistoryToSee: () => {},

    showMyInfoModal: false,
    setShowMyInfoModal: () => {},

    viewEnglish: true,
    setViewEnglish: () => {},

    showConfigureHistoryReg: false,
    setShowConfigureHistoryReg: () => {},

    reloadDoctorApp: false,
    setReloadDoctorApp: () => {},

    viewDisplayAppointmentComponent: false,
    setViewDisplayAppointmentComponent: () => {},

    viewDisplayPatientComponent: false,
    setViewDisplayPatientComponent: () => {},

    viewLastReg: false,
    setViewLastRegL: () => {},

    userAuthed: null,
    setUserAuthed: () => {},

    successMessage: null,
    setSuccessMessage: () => {},

    errorMessage: null,
    setErrorMessage: () => {},

    selectedOptions: [],
    setSelectedOptions: () => {},
    clearList: () => {},

    dispatchCalEvent: ({ type, payload }) => {},
    savedEvents: [],
    selectedEvent: null,
    setSelectedEvent: () => {},
    setLabels: () => {},
    labels: [],
    updateLabel: () => {},
    filteredEvents: [],
});

export default GlobalContext;