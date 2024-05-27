import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

// export const baseURL = 'http://172.20.10.3:5000';
export const baseURL = "https://repeddle-backend.onrender.com";

const api = axios.create({
  baseURL: baseURL + "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // You can modify the request config here (e.g., add authentication headers)
    // const token = await SecureStore.getItemAsync("authToken");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI1NjAyYjFlNzcyNGZjNWMyNjhiMDIiLCJlbWFpbCI6ImVtaXJhY2Vncm91cEBnbWFpbC5jb20iLCJ2ZXJzaW9uIjoiTmFOMTExMTExMTExMTExIiwiaWF0IjoxNzE2NTA2MjY3LCJleHAiOjE3MTkwOTgyNjd9.42JnIolX9r_hTZ6hcjuMEyPmg9VC8hSSQHf0vTqWNF8";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can handle successful responses here
    return response.data; // Return only the response data
  },
  (error: AxiosError) => {
    // Handle response errors here
    if (error.response) {
      // Server responded with an error status code (4xx or 5xx)
      console.error("API Error Response:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API No Response:", error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("API Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
