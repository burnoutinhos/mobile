import AxiosMockAdapter from "axios-mock-adapter";
import { endpoints } from "../endpoints";
import { RegisterResponse, SignInType } from "../../../model/login/LoginTypes";
import { api } from "../axios-client";

const mock = new AxiosMockAdapter(api, { delayResponse: 1000 });

mock.onPost(endpoints.auth.login).reply((config) => {
  const { email, password, confirmPassword } = JSON.parse(
    config.data,
  ) as SignInType;

  if (!email || !password || !confirmPassword)
    return [
      400,
      {
        error: true,
        message: "Dados invalidos",
      } as RegisterResponse,
    ];

  if (!(password == confirmPassword))
    return [
      400,
      {
        error: true,
        message: "Senha e confirmar senha devem ser iguais",
      } as RegisterResponse,
    ];

  return [
    201,
    {
      error: false,
      message: "Usuario criado com sucesso",
      data: {
        token: "dusane19321yu38nd12923n1",
      },
    } as RegisterResponse,
  ];
});
