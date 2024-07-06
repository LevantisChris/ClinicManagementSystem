import React, { useState, useContext, useEffect } from "react";
import './App.css';
import { getMonth } from './util'
import CalendarHeader from "./components/CalendarHeader";
import SideBar from "./components/SideBar";
import Month from "./components/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal";
import InsertModal from "./components/InsertModal";

function App() {
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const {monthIndex, showEventModal, showInsertModal} = useContext(GlobalContext);

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex])

  return (
    <React.Fragment>
        {showEventModal === true && <EventModal/>}
        {showInsertModal === true && <InsertModal/>}
        <div className={'h-screen flex flex-col'}>
            <CalendarHeader />
            <div className={'flex flex-1'}>
                <SideBar />
                <Month month={currentMonth}/>
            </div>
        </div>
    </React.Fragment>
  );
}

export default App;
