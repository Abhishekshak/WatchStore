import axios from 'axios';

const api = axios.create({
  baseURL: 'https://67cfa787823da0212a82e97a.mockapi.io/api/v1/',
});

export default api;
