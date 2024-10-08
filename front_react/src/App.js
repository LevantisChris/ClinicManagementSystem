import React, {useContext, useState} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import DoctorApp from "./components/doctor/DoctorApp";
import AuthApp  from "./components/Auth/AuthApp";
import './App.css';
import PatientApp from "./components/Patient/PatientApp";
import SecretaryApp from "./components/Secretary/SecretaryApp";

const App = () => {
    return (
        <BrowserRouter>
            <div className={""}>
                <Routes>
                    <Route path={"/"}
                           element={<AuthApp/>}/>
                    <Route path={"/auth"}
                           element={<AuthApp/>}/>
                    {/* Protected routes */}
                    <Route path={"/doctor"}
                           element={<DoctorApp/>}/>
                    <Route path={"/patient"}
                           element={<PatientApp/>}/>
                    <Route path={"/secretary"}
                           element={<SecretaryApp/>}/>
                    <Route path={"*"}
                           element={<Navigate to="/auth"/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;