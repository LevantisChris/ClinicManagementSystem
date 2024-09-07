import React from 'react';
import './LoadingApp.css';
import logo from "../assets/health.png";
import UserService from "../services/UserService"; // Import stylesheet for custom styling

const LoadingApp = () => {
    return (
        <div className="flex flex-col loading-container">
            <img src={logo} alt={'Logo'} className={'logo mb-5'}/>
            <div className="loading-spinner mb-3"/>
            <a className={"font-bold text-sm cursor-default"}>Taking too long ?</a>
            <a href={'/auth'} onClick={() => UserService.logout()} className={"font-bold text-lg hover:text-blue-700"}>
                Click here to log in again
            </a>
        </div>
    );
};

export default LoadingApp;