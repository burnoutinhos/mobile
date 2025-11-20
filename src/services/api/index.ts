import AsyncStorage from "@react-native-async-storage/async-storage";
import "./mock/index";
import { api } from "./axios-client";

// Callback para logout
let onUnauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

// Interceptor de requisição
api.interceptors.request.use(
  async (config) => {
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
    console.log("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  },
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    // Se receber 403, executa o logout
    if (error.response?.status === 403) {
      console.log("🔒 403 Forbidden - Executando logout");
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }

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
