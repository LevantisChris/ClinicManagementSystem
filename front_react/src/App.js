import React from "react";
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
                    <Route path={"/"}
                           element={<AuthApp/>}/>
                    <Route path={"/doctor"}
                           element={<DoctorApp/>}/>
                    <Route path={"/auth"}
                           element={<AuthApp/>}/>

                    {UserService.isDoctor()
                        && UserService.isAuthenticated()
                        &&
                        (
                            <>
                                <Route path={"/doctor"}
                                       element={<DoctorApp/>}/>
                            </>
                        )
                    }
                    <Route path={"*"}
                           element={<Navigate to="/auth"/>}/>

                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;