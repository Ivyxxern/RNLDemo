import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost/RNLDemo/server/public/api";

const AxiosInstance = axios.create({ baseURL: API_BASE_URL });

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config
});

AxiosInstance.interceptors.response.use(
  (Response) => {
    return Response;
  },
  (error) => {
    if (!error?.response) {
      console.error('Network or CORS error: ', error)
      return Promise.reject(error)
    }

    if (error.response.status !== 422) {
      console.error('Unexpected response error: ', error)
    }

    return Promise.reject(error)
  }
)

export default AxiosInstance;