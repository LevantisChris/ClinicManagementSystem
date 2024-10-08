import React, {useContext} from 'react'

import plus from '../../../assets/plus.svg'
import GlobalContext from "../../../context/GlobalContext";

export default function CreateEventButton() {
    const {setShowEventModal} = useContext(GlobalContext);

    return (
        <button onClick={() => setShowEventModal(true)} className={'border mb-1 p-2 rounded-full flex items-center shadow-md hover:shadow-2xl'}>
            <img src={plus} alt={"create_event"} className={'w-7 h-7'}/>
            <span className={'pl-3 pr-7'}>Create</span>
        </button>
    );
}