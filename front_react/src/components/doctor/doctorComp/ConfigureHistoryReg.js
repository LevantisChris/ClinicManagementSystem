import {React} from 'react'
import SearchPatients from "./SearchPatients";

/* Configure: Update and Delete, the concept is that at first the user doctor will have to
*  search for the patient he wants. Then he/she can click in the patient, and a nice modal will appear
*  with the functions of delete and update of only the last registration. */

export default function ConfigureHistoryReg() {

    return (
        <div className={"w-full"}>
            <SearchPatients bigTitle={"Configure the last registration of a patient"}
                            smallTitle={"Search a patient and then by selecting them you can configure him/her"}
                            componentState={1}
            />
        </div>
    );

}