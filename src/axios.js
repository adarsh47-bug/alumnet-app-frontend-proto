// frontend/src/axios.js
import axios from 'axios';

const instance = axios.create({
  // baseURL: 'https://basic-app-backend.azurewebsites.net/',
  baseURL: 'https://alumnet-backend-proto.onrender.com/',
  // baseURL: 'http://localhost:5000/',
});

export default instance;

