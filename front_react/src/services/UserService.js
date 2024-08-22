import axios from "axios";

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
            console.error(err);
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





    /* Check if its log in, role etc */
    static logout() {
        localStorage.removeItem("token");
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        console.log(token)
        return !!token;
    }

    static isDoctor() {
        const role = localStorage.getItem("role");
        console.log(role);
        return role === 'USER_DOCTOR'
    }

    static isPatient() {
        const role = localStorage.getItem("role");
        return role === 'USER_PATIENT'
    }

    static isSecretary() {
        const role = localStorage.getItem("role");
        return role === 'USER_SECRETARY'
    }
}

export default UserService;