import React, {useContext} from 'react'


import logo from '../../../assets/health.png';
import user_32IMG from '../../../assets/icons8-user-50.png';
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";

export default function CalendarHeader() {
    const {monthIndex, setMonthIndex} = useContext(GlobalContext);


    function handlePrevMonth() {
        setMonthIndex(monthIndex - 1);
    }

    function handleNextMonth() {
        setMonthIndex(monthIndex + 1);
    }

    /* if we keep the code like this: setMonthIndex(dayjs().month()) then when the user interacts only with the
    *  small calendar and then press the Today button the button will not work, because the dayjs().month() only
    *  works if the month is not equal to the current */
    function handleReset() {
        setMonthIndex( monthIndex === dayjs().month() ? monthIndex + Math.random() : dayjs().month());
    }

    return (
        <header className={'px-4 py-2 flex items-center'}>
            <img src={logo} alt={'Calendar'} className={'mr-2 w-12 h-12'}/>
            <h1 className={'mr-10 text-xl text-gray-500 font-bold'}>HealthSyS</h1>
            <button className={'border rounded py-2 px-4 mr-5'} onClick={handleReset}>
                Today
            </button>
            <button onClick={handlePrevMonth}>
                <span className={'material-icons-outlined cursor-pointer text-gray-600 mx-2'}>
                    chevron_left
                </span>
            </button>
            <button onClick={handleNextMonth}>
                <span className={'material-icons-outlined cursor-pointer text-gray-600 mx-2'}>
                    chevron_right
                </span>
            </button>
            <h2 className={'ml-4 text-xl text-gray-500 font-bold'}>
                {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            </h2>
            <div className="flex items-center ml-auto gap-2"> {/* Align items to the right */}
                <div className="grid grid-rows-2 grid-cols-1 justify-items-end">
                    <span className="text-gray-600">Chris Levantis</span>
                    <span className="text-gray-600 text-xs">Doctor</span>
                </div>
                <img src={user_32IMG} alt="User Icon" className="w-8 h-8 rounded-full mr-2"/>
            </div>
        </header>
    );
}