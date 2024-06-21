import axios from 'axios';

// Backend API URL
const API_URL = `http://localhost:5000/api`;

const getToken = () => {
    return localStorage.getItem('token');
};

export const login = (credentials) => {
    return axios.post(`${API_URL}/auth/login`, credentials);
};

export const getServers = () => {
    const token = getToken();
    return axios.get(`${API_URL}/servers` , {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const deleteServer = (id) => {
    const token = getToken();
    return axios.delete(`${API_URL}/servers/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const getServerStatus = (ip) => {
    const token = getToken();
    return axios.get(`${API_URL}/servers/status/${ip}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const token = getToken();

export const getReport = ({ ip, startDate, endDate }) => {
    return axios.post(`${API_URL}/report`, {
        ip,
        startDate,
        endDate
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
export const addServer = (server) => {
    const token = getToken();
    return axios.post(`${API_URL}/servers`, server, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const getRole = () => {
    const token = getToken();   
    return axios.get(`${API_URL}/auth/role`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const registerUser = (userData) => {
    const token = getToken();
    return axios.post(`${API_URL}/auth/register`, userData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const logoutUser = () => {
    const token = getToken();
    return axios.post(`${API_URL}/auth/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};