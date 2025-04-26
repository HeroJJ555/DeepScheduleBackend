import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true         
});

//Łapanie błędów
api.interceptors.response.use(
    res => res,
    err => {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Coś poszło nie tak';
      toast.error(msg);
      return Promise.reject(err);
    }
  );

export default api;
