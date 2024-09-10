import axios from "axios";

async function fetchUserRole(token) {
    try {
        const userData = await UserService.getUserDetails(token);
        // Assuming userData is a user object, not an array of users
        return userData.users.role_str; // Make sure the path is correct
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null; // Return null in case of an error
    }
}

class UserService {
    static BASE_URL = "http://localhost:8080";

    static async getUserDetails(token) {
        try {
            if (token) {
                const response = await axios.get(`${UserService.BASE_URL}/user-details`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                return response.data;
            } else {
                throw new Error('Token is required');
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
            throw err;
        }
    }

    static async login(email, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {
                userEmail: email,
                userPassword: password
            });
            if (response.data.statusCode === 500) {
                throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
            } else {
                return response.data;
            }
        } catch (err) {
           throw err;
        }
    }


    static async register(userData) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData);
            if (response.data.statusCode === 500) {
                throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
            } else {
                return response.data;
            }
        } catch (err) {
            throw err;
        }
    }

    static async deleteUser(userId, token){
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getDoctorIdFromToken() {
        const token = localStorage.getItem("token");
        if(token === null)
            return null;
        try {
            const response = await axios.get(`${UserService.BASE_URL}/doctor/get-id`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async defineWorkingHours(data) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${UserService.BASE_URL}/appoint/register-wh`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getWorkingHoursOfADoctor() {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/appoint/get-wh`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async deleteWorkingHours(data) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.request({
                method: 'DELETE',
                url: `${UserService.BASE_URL}/appoint/delete-wh`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: data
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async createAppointment(data) {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.post(`${UserService.BASE_URL}/appoint/create`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    /* Get all appointments that belong
    *  to a particular user (Doctor), we
    *  check the user based on the token */
    static async getAllForADayAppointments(params) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/appoint/getAllForDay`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async getAllForAMonthAppointments(data) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${UserService.BASE_URL}/appoint/getAllForMonth`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async updateAppointment(data) {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.put(`${UserService.BASE_URL}/appoint/update`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async cancelAppointment(data) {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.put(`${UserService.BASE_URL}/appoint/cancel`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async searchAppointment(data) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${UserService.BASE_URL}/appoint/search`, data,{
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async displayAppointmentBasedOnId(appointmentId) {
        const params = {
            appointmentId:appointmentId
        }
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/appoint/display-by-id`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async getAllPatients() {
        const params = {
            AMKA:"",
            surname:""
        }
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/patient-mangt/search`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async registerPatient(data) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${UserService.BASE_URL}/patient-mangt/create`, data,{
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (err) {
            return err.response ? err.response.data : err;
        }
    }

    static async searchPatients(params) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/patient-mangt/search`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async displayPatientsById(params) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/patient-mangt/searchById`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async updatePatient(data) {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.put(`${UserService.BASE_URL}/patient-mangt/update`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async deletePatient(params) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/patient-mangt/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async getCreateAndRespectedAppointments() {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/appoint/getAllCreatedAndResp`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async createPatientHistoryRegistration(data) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${UserService.BASE_URL}/history-patient-mangt/create`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (err) {
            return err.response ? err.response.data : err;
        }
    }

    static async getLastPatientHistoryReg(params) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/history-patient-mangt/getLastRegistrationOfPatient`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async getAllPatientHistory(params) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/history-patient-mangt/displayAllHistory`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }


    static async deletePatientRegistration(params) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/history-patient-mangt/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    static async updatePatientRegistration(data) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(`${UserService.BASE_URL}/history-patient-mangt/update`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async searchRegistrations(params) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/history-patient-mangt/searchRegistration`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    /* Based in the patientID get the appointments */
    static async getPatientAppointments(params) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/appoint/getPatientAppointments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }

    /* Only the secretary can get all the appointments */
    static async getSecretaryAppointments() {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${UserService.BASE_URL}/appoint/getAllAppointments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return err.response ? err.response.data : err;
        }
    }


    static async checkRole(role) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found");
            return false;
        }

        try {
            const role_str = await fetchUserRole(token);
            console.log(`Checking role: ${role_str}`);
            return role_str === role;
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            return false; // Returning false in case of error
        }
    }


    /* Check if its log in, role etc */
    static logout() {
        localStorage.removeItem("token");
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        if(token) {
            console.log("Token is authenticated");
            return true
        } else {
            console.log("Token is not authenticated");
            return false;
        }
    }

    static isDoctor() {
        return this.checkRole('USER_DOCTOR');
    }

    static isPatient() {
        return this.checkRole('USER_PATIENT');
    }

    static isSecretary() {
        return this.checkRole('USER_SECRETARY');
    }
}

export default UserService;