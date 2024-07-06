import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorApp from "./components/doctor/DoctorApp";
import LogInApp  from "./components/LogSign/LogInApp";
import './App.css';

const App = () => {
    return (
        <BrowserRouter>
            <div className={""}>
                <Routes>
                    /* NOTE: In v6 the render approach dont need to be implemented
                    element do the job itself */
                    <Route path={"/doctor"}
                           element={<DoctorApp/>}/>
                    <Route path={"/login"}
                           element={<LogInApp/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;