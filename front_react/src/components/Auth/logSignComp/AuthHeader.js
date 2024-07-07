import React from 'react'
import AuthAppCSS from '../AuthAppCSS.css';


import logo from '../../../assets/health.png';

export default function LogSignHeader() {

    return (
        <header className={'px-4 py-2 flex items-center'}>
            <img src={logo} alt={'Logo'} className={'logo'}/>
        </header>
    );
}