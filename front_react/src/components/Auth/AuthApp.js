import React, {useEffect, useState} from 'react'
import AuthAppCSS from './AuthAppCSS.css';

import nameIMG from '../../assets/user_32.png';
import doctorTypeIMG from '../../assets/doctor-type.png';
import passwdIMG from '../../assets/passwd_32.png';
import emailIMG from '../../assets/email_32.png';
import idNumberIMG from '../../assets/id_number.png';
import checkIMG from '../../assets/check.png';
import generalUserIMG from '../../assets/user.png';
import LogSignHeader from "./logSignComp/AuthHeader";
import {color} from "framer-motion";

/*
*   Patient: ID-Number, Name, Surname, email, password, ||AMKA||
*   Doctor: ID-Number, Name, Surname, email, password, ||Speciality||
*   Secretary: ID-Number, Name, Surname, email, password
*/

const AuthApp = () => {
    const [action, setAction] = useState('Log in');

    const [AMKA, setAMKA] = useState('');

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [idNumber, setIdNumber] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [speciality, setSpeciality] = useState('Cardiology');

    const [role, setRole] = useState('Doctor');

    const [apiResponse, setApiResponse] = useState('');

    const [loading, setLoading] = useState(false);

    /* When the components mount make a GET request to /auth */
    useEffect(() => {
        // Fetch data when component mounts
        callAPI();
    }, []);

    const callAPI = () => {
        fetch('http://localhost:5000/auth')
            .then(res => res.text())
            .then(res => setApiResponse(res))
            .catch(error => console.log(error)); // Add error handling
    };
    /* ------------------------------------------------------------------ */

    /* This is to get the values from the inputs */
    const handleAMKAChange = (event) => {
        setAMKA(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSurnameChange = (event) => {
        setSurname(event.target.value);
    };

    const handleIdNumberChange = (event) => {
        setIdNumber(event.target.value);
    };

    const handleSpecialityChange = (event) => {
        setSpeciality(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleActionChange = (newAction) => {
        setLoading(true);
        setTimeout(() => {
            setAction(newAction);
            setLoading(false);
        }, 500); // delay for transition effect
    };

    const handleSubmit = () => {
        const credentials = {
            AMKA: AMKA,
            email: email,
            password: password
        };

        fetch('http://localhost:5000/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className={'container'}>
            <div className={'header'}>
                <LogSignHeader/>
                <div className={'underline'}></div>
            </div>
            <div className={`inputs text-center ${loading ? 'hidden' : ''}`}>
                <div className={'text'}>
                    Welcome, {action === "Visitor" ? "about us" : action}
                </div>

                {loading && <div className="loading-spinner"></div>}

                {action === "Visitor" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl bg-blue-200 p-5 shadow-xl gap-4">
                        <div className="flex flex-col items-center">
                            <div
                                className="flex items-center justify-center w-40 h-40 md:w-80 md:h-80 rounded-full text-white text-4xl md:text-9xl shadow-xl bg-blue-500">
                                5
                            </div>
                            <div className="mt-2 text-2xl md:text-4xl text-center text-blue-500">
                                Specialized doctors
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="flex items-center justify-center w-40 h-40 md:w-80 md:h-80 rounded-full text-white text-4xl md:text-9xl shadow-xl bg-blue-500">
                                +150
                            </div>
                            <div className="mt-2 text-2xl md:text-4xl text-center text-blue-500">
                                Happy Patients
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center">
                            <div className="text-2xl md:text-4xl mb-4 text-blue-500">
                                You can find us
                            </div>
                            <div className="w-full h-60 md:h-80 bg-gray-300 rounded-xl shadow-xl">
                                <iframe
                                    className="w-full h-full rounded-xl shadow-xl"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d196.54487515085663!2d23.759763974933495!3d37.98370987626771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd557f467fd1%3A0x61f97fa3f099b4c6!2zwqvOmc-Az4DOv866z4HOrM-EzrXOuc6_wrsgzpPOtc69zrnOus-MIM6dzr_Pg86_zrrOv868zrXOr86_IM6RzrjOt869z47OvQ!5e0!3m2!1sel!2sgr!4v1720444210514!5m2!1sel!2sgr"
                                    frameBorder="0"
                                    allowFullScreen=""
                                    aria-hidden="false"
                                    tabIndex="0">
                                </iframe>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}


                {(role === 'Patient' || role === 'Doctor' || role === 'Secretary') && action === "Sign up" && (
                    <React.Fragment>
                        <div className='input'>
                            <img src={generalUserIMG} alt={' '}></img>
                            <select className={"input"} id='role' value={role} onChange={handleRoleChange}>
                                <option value='Doctor'>Doctor</option>
                                <option value='Patient'>Patient</option>
                                <option value='Secretary'>Secretary</option>
                            </select>
                        </div>
                        <div className='input'>
                            <img src={nameIMG} alt=' '/>
                            <input
                                type='text'
                                placeholder='Name'
                                value={name}
                                onChange={handleNameChange}
                            />
                        </div>
                        <div className='input'>
                            <img src={nameIMG} alt=' '/>
                            <input
                                type='text'
                                placeholder='Surname'
                                value={surname}
                                onChange={handleSurnameChange}
                            />
                        </div>
                        <div className='input'>
                            <img src={emailIMG} alt=' '/>
                            <input
                                type='email'
                                placeholder='Email'
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className='input'>
                            <img src={idNumberIMG} alt=' '/>
                            <input
                                type='text'
                                placeholder='ID number'
                                value={idNumber}
                                onChange={handleIdNumberChange}
                            />
                        </div>
                        {role === 'Patient' ?
                            <div className='input'>
                                <img src={checkIMG} alt=' '/>
                                <input
                                    type='text'
                                    placeholder='AMKA'
                                    value={AMKA}
                                    onChange={handleAMKAChange}
                                />
                            </div> : <></>
                        }
                        {role === 'Doctor' ?
                            <div className='input'>
                                <img src={doctorTypeIMG} alt={' '}></img>
                                <select className={"input"} value={speciality} onChange={handleSpecialityChange}>
                                    <option value='Anesthesiology'>Anesthesiology</option>
                                    <option value='Cardiology'>Cardiology</option>
                                    <option value='Forensic Pathology'>Forensic Pathology</option>
                                    <option value='General Surgery'>General Surgery</option>
                                </select>
                            </div> : <></>
                        }
                    </React.Fragment>
                )}

                {/* If the action is Log in we will hide the name input field */}
                {action === "Log in" ? <React.Fragment>
                    <div className={'input'}>
                        <img src={emailIMG} alt={' '}></img>
                        <input type={'email'} placeholder={"email"} value={email} onChange={handleEmailChange}></input>
                    </div>
                    <div className={'input'}>
                        <img src={passwdIMG} alt={' '}></img>
                        <input type={'password'} placeholder={"password"} value={password}
                               onChange={handlePasswordChange}></input>
                    </div>
                </React.Fragment> : <div></div>
                }
                {action !== "Visitor" ?
                    <div className={'submit-container'}>
                        <div className={'submit shadow-xl'} onClick={handleSubmit}>Submit</div>
                    </div>
                    : <></>
                }

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '5px'
                }}>
                    <div className="underline" style={{borderBottom: '1px solid black'}}></div>
                </div>


                <div className="submit-container grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        className={`submit ${action === "Sign up" ? "gray" : ""} shadow-xl`}
                        onClick={() => {
                            handleActionChange("Sign up");
                        }}
                    >
                        Sign up
                    </div>
                    <div
                        className={`submit ${action === "Log in" ? "gray" : ""} shadow-xl`}
                        onClick={() => {
                            handleActionChange("Log in");
                        }}
                    >
                        Log in
                    </div>
                    <div
                        className={`submit ${action === "Visitor" ? "gray" : ""} shadow-xl`}
                        onClick={() => {
                            handleActionChange("Visitor");
                        }}
                    >
                        Visitor
                    </div>
                </div>


            </div>
        </div>
    );
}

export default AuthApp;