CREATE TABLE role
(
    role_id INTEGER PRIMARY KEY NOT NULL,
    role_description VARCHAR(100) NOT NULL
);

CREATE TABLE user
(
    user_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    user_surname VARCHAR(150) NOT NULL,
    user_idNumber VARCHAR(8) NOT NULL,
    user_email VARCHAR(150) NOT NULL,
    user_password CHAR(60) NOT NULL, ## Adjusted length passed for hashing
    user_role INTEGER NOT NULL,
    FOREIGN KEY (user_role) REFERENCES role(role_id)
);

CREATE TABLE patient
(
	patient_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL, ## reference to user_id
    patient_AMKA VARCHAR(11) NOT NULL,
    patient_registrationDate DATE NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES user(user_id)
);

CREATE TABLE doctor_speciality
(
	speciality_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
    speciallity_description VARCHAR(200) NOT NULL
);

CREATE TABLE doctor
(
	doctor_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL, ## reference to user_id
    doctor_speciality INTEGER NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES user(user_id),
    FOREIGN KEY (doctor_speciality) REFERENCES doctor_speciality(speciality_id)
);

CREATE TABLE appointment_state
(
	appointment_state_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
    appointment_state_description VARCHAR(20) NOT NULL
);

CREATE TABLE appointment
(
    appointment_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_justification VARCHAR(500) NOT NULL,
    appointment_creationDate DATE NOT NULL,
    appointment_state INTEGER NOT NULL,
    appointment_patient INTEGER NOT NULL,
    appointment_doctor INTEGER NOT NULL,
    FOREIGN KEY (appointment_state) REFERENCES appointment_state(appointment_state_id),
    FOREIGN KEY (appointment_patient) REFERENCES patient(patient_id),
    FOREIGN KEY (appointment_doctor) REFERENCES doctor(doctor_id)
);
