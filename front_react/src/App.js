import React, {useContext, useState} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import DoctorApp from "./components/doctor/DoctorApp";
import AuthApp  from "./components/Auth/AuthApp";
import './App.css';
import UserService from "./services/UserService";

const App = () => {
    return (
        <BrowserRouter>
            <div className={""}>
                <Routes>
                    {/*<Route path={"/"}
                           element={ UserService.isDoctor() && UserService.isAuthenticated() ? <DoctorApp/>
                               : UserService.isPatient() && UserService.isAuthenticated() ? <PatientApp/>
                                   : UserService.isSecretary() && UserService.isAuthenticated() ? <SecretaryApp/>
                    */}
                    <Route path={"/"}
                           element={<AuthApp/>}/>
                    <Route path={"/auth"}
                           element={<AuthApp/>}/>
                    {/* Protected routes */}
                    <Route path={"/doctor"}
                           element={<DoctorApp/>}/>
                    <Route path={"*"}
                           element={<Navigate to="/auth"/>}/>

                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;