import AsyncStorage from "@react-native-async-storage/async-storage";
import "./mock/index";
import { api } from "./axios-client";

api.interceptors.request.use(async (config) => {
  const headers = (config.headers as any) || {};

  const skipAuthRaw = headers["x-skip-auth"] ?? headers["X-Skip-Auth"];
  const shouldSkip =
    skipAuthRaw === true ||
    (typeof skipAuthRaw === "string" && skipAuthRaw.toLowerCase() === "true");

  if (headers["x-skip-auth"]) delete headers["x-skip-auth"];
  if (headers["X-Skip-Auth"]) delete headers["X-Skip-Auth"];

  if (shouldSkip) {
    config.headers = headers;
    return config;
  }

  try {
    // Lê o token atual do AsyncStorage (evita usar hooks aqui)
    const token = await AsyncStorage.getItem("TOKEN");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // falha ao ler AsyncStorage -> enviar sem Authorization
  }

  config.headers = headers;
  return config;
});

export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
} as const;

export default api;
