import AxiosMockAdapter from "axios-mock-adapter";

import { api } from "../axios-client";
import { endpoints } from "../endpoints";
import { LoginType } from "../../../model/auth/LoginTypes";
import { AuthResponse } from "../../../model/auth/types";

export const loginMock = () => {
  const mock = new AxiosMockAdapter(api, { delayResponse: 1000 });

  mock.onPost(endpoints.auth.login).reply((config) => {
    const { email, password } = JSON.parse(config.data) as LoginType;

    if (!email || !password) {
      return [
        400,
        {
          error: true,
          message: "Dados inválidos",
        } as AuthResponse,
      ];
    }

    return [
      200,
      {
        error: false,
        message: "Usuário logado com sucesso",
        data: {
          token: "jsdiajopdi91j213j921",
        },
      } as AuthResponse,
    ];
  });
};

process.env.NODE_ENV === "development" &&
  process.env.EXPO_PUBLIC_USE_MOCK === "true" &&
  loginMock();
