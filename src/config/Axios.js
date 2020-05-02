import axios from 'axios';

//'http://tournament.api.com

const baseURL = window.BASE_URL;

const AXIOS = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Partners-Application': 'portal'
  },
  timeout: 100000,
});

export default AXIOS;