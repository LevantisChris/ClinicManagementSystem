import {React, useContext} from 'react'
import SearchPatients from "./SearchPatients";
import GlobalContext from "../../../context/GlobalContext";

/* Configure: Update and Delete, the concept is that at first the user doctor will have to
*  search for the patient he wants. Then he/she can click in the patient, and a nice modal will appear
*  with the functions of delete and update of only the last registration. */

export default function ConfigureHistoryReg() {

    const {
        viewEnglish
    } = useContext(GlobalContext)

    return (
        <div className={"w-full"}>
            <SearchPatients bigTitle={viewEnglish ? "Configure the last registration of a patient" : "Διαμόρφωση της τελευταίας εγγραφής ενός ασθενούς"}
                            smallTitle={viewEnglish ? "Search a patient and then by selecting them you can configure him/her" : "Αναζητήστε έναν ασθενή και στη συνέχεια, επιλέγοντάς τον, μπορείτε να τον διαμορφώσετε."}
                            componentState={1}
            />
        </div>
    );

}