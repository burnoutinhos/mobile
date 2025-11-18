import AxiosMockAdapter from "axios-mock-adapter";
import { endpoints } from "../endpoints";
import { RegisterType } from "../../../model/auth/RegisterTypes";
import { api } from "../axios-client";
import { AuthResponse } from "../../../model/auth/types";

const registerMock = () => {
  const mock = new AxiosMockAdapter(api, { delayResponse: 1000 });

  mock.onPost(endpoints.auth.login).reply((config) => {
    const { email, password, confirmPassword, name } = JSON.parse(
      config.data,
    ) as RegisterType;

    if (!name || !email || !password || !confirmPassword)
      return [
        400,
        {
          error: true,
          message: "Dados invalidos",
        } as AuthResponse,
      ];

    if (!(password == confirmPassword))
      return [
        400,
        {
          error: true,
          message: "Senha e confirmar senha devem ser iguais",
        } as AuthResponse,
      ];

    return [
      201,
      {
        error: false,
        message: "Usuario criado com sucesso",
        data: {
          token: "dusane19321yu38nd12923n1",
        },
      } as AuthResponse,
    ];
  });
};

process.env.NODE_ENV === "development" &&
  process.env.EXPO_PUBLIC_USE_MOCK === "true" &&
  registerMock();
