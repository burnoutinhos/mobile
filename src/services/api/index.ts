import AsyncStorage from "@react-native-async-storage/async-storage";
import "./mock/index";
import { api } from "./axios-client";
import { useAuth } from "../../context/AuthProvider";

const getToken = async () => {
  const { token } = useAuth();
  return token;
};

// Interceptor de requisição
api.interceptors.request.use(
  async (config) => {
    // Log da requisição
    console.log("🚀 REQUEST:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      params: config.params,
      data: config.data,
    });

    const headers = config.headers;

    const skipAuth = headers["x-skip-auth"] === true;

    if (headers["x-skip-auth"]) delete headers["x-skip-auth"];

    if (skipAuth) {
      config.headers = headers;
      return config;
    }

    try {
         // Directly read the token from AsyncStorage (as per the commented line)
         const token = await AsyncStorage.getItem("TOKEN");
         if (token) {
           headers["Authorization"] = `Bearer ${token}`;
         }
       } catch (e) {
         // Optionally log or handle the error
       }

    config.headers = headers;
    return config;
  },
  (error) => {
    // Log de erro na requisição
    console.log("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  },
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    // Log da resposta bem-sucedida
    console.log("✅ RESPONSE:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Substitui a mensagem do erro pela mensagem do backend (se existir)
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    // Log de erro na resposta
    console.log("❌ RESPONSE ERROR:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
    });

    return Promise.reject(error);
  },
);

export default api;
