import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8080";

    static async login(email, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {
                userEmail: email,
                userPassword: password
            });
            if (response.data.statusCode === 500) {
                throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
            } else
                return response.data;
        } catch (err) {
           throw err;
        }
    }


    static async register(userData) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData);
            if (response.data.statusCode === 500) {
                throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
            } else
                return response.data;
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

    /* Check if its log in, role etc */
    static logout() {
        localStorage.removeItem("token");
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        return !!token;
    }

    static isDoctor() {
        const role = localStorage.getItem("role");
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