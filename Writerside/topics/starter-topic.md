# About Clinic Management System 🧑‍⚕️

## Application Structure
The application uses React.js for the front-end and Spring for the back-end logic. 
The two servers communicate by exchanging HTTP requests. Additionally, 
a relational MySQL database is used to store and retrieve application data, 
which interacts with the Spring server. The system architecture is illustrated below.
![structure.png](structure.png)

## Logic (Back-end)
The structure of the Spring Server is straightforward. 
The entity folder contains all files related to the creation and 
definition of the database. The dto folder defines the data for each entity, 
making data exchange easier. In the repository folder, we have all the functions 
used to retrieve and store data in the database (Spring handles this automatically). 
The config folder primarily defines security rules. The controller folder defines all 
the endpoints and the services they interact with. 
Finally, in the services folder, the core system logic is managed, with all services defined.

The Spring Server utilizes technologies such as

- **Spring Security**, 
- **JPA Repository** and, 
- **JWT**. 

These three technologies were crucial in simplifying important aspects of the application. 
Specifically, database operations like creation and retrieval were largely automated thanks to JPA. 
Security aspects such as password encryption during authentication, endpoint access control, request 
filtering, role management, and the definition of security rules were made easier with Spring Security. 
JWT tokens played a key role in structuring the application's UI. When a user registers or logs in with
an existing account, a session containing a JWT token is created on the Spring Server. 
This token is sent to the React Server, enabling it to render the appropriate UI and functionalities for each user. 
The token is stored in the browser's local storage. For every request sent from the React Server, the token is included, 
along with any other necessary data (typically in JSON format). If the token is not provided, 
the Spring Server blocks any data exchange. The token is essential for the back-end server as well, 
since each function behaves differently based on the role retrieved from the token. The token contains 
encrypted information about the user's username and role.

## UI (Front-end)

As previously mentioned, the front-end was built using React along with [Tailwind CSS](https://tailwindcss.com/) for streamlined styling. The structure is divided into three main folders: `Doctor`, `Patient`, and `Secretary`. Each role has its own set of components, as each user should only see the relevant information.

There are three routes: `/doctor`, `/patient`, and `/secretary`. Each route leads to a main component: `DoctorApp`, `PatientApp`, and `SecretaryApp`, respectively. The routing to the appropriate component is based on the user’s role.

It’s important to note that the React Server doesn’t handle any business logic, except for generating PDFs (Patient History Records) and sending properly formatted requests (via the `UserService` class). Each main component has several sub-components depending on the user’s permissions. Lastly, the `Auth` folder contains everything related to registration and login functionalities.

## Functionalities

| Category                | Actions                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| **Manage Patients**      | Register Patient, Register Patient Massively, Display Patient, Update Patient, Search Patient, Delete Patient |
| **Manage Patient History** | Create History Registration, Create History Registrations (Massively), Update History Registration, Delete History Registration, Display History Registration, Display All History Registrations, Search History |
| **Manage Appointments**  | Create an Appointment, Update Appointment, Cancel Appointment, Display Appointment, Search Appointment, Define Working Hours of a Doctor (Availability) |


## Roles & Functionalities

We have three roles:

- **Patient**
- **Doctor** (super-user)
- **Secretary**
- **Visitor**

| Role      | Functions                                                                   |
|-----------|-----------------------------------------------------------------------------|
| Visitor   | Display general clinic information + registration and authentication pages. |
| Patient   | Same as the visitor + manage appointments + manage personal information + view/search medical history.  |
| Secretary | Manage appointments + manage patients.      |
| Doctor    | All.                                                                        |

## App Look & Feel

![doctorMainScreen.png](doctorMainScreen.png)

*Description: Doctor Main UI.*

**Run the app to explore more!!!**