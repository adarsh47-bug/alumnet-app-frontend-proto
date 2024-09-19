// frontend/src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://alumnet-proto-backend.azurewebsites.net/'
});

export default instance;

// baseURL: 'https://alumnet-backend-proto.onrender.com/',
// baseURL: 'http://localhost:5000/',
