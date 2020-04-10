import axios from 'axios';

//'http://tournament.api.com

const AXIOS = axios.create({
  baseURL: 'http://tournament.api.com',
  headers: {
    'Content-Type': 'application/json',
    'Partners-Application': 'portal'
  },
  timeout: 100000,
});

export default AXIOS;