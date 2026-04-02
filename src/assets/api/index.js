import axios from 'axios';

const API = axios.create({
    // Admin runs on same computer as backend, so use localhost
    baseURL: 'http://localhost:5001/api', 
});

export default API;