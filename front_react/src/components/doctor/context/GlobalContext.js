import React from "react";

const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: (index) => {},
    smallCalendarMonth: 0,
    setSmallCalendarMonth: (index) => {},
    daySelected: null,
    setDaySelected: (day) => {},

    showEventModal: false,
    setShowEventModal: () => {},

    showInsertModal: false,
    setShowInsertModal: () => {},

    showDescriptionInsertModal: false,
    setShowDescriptionInsertModal: () => {},

    showActiveHoursModal: false,
    setShowActiveHoursModal: () => {},

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