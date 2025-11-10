import * as yup from "yup";

const SignInSchema = yup.object().shape({
  email: yup.string().email("Email invalido").required("Email obrigatorio"),
  password: yup
    .string()
    .min(8, "Senha deve ter no minimo 8 caracteres")
    .required("Senha obrigatoria"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "As senhas devem coincidir")
    .required("Confirmar senha obrigatoria"),
});

type SignInType = yup.InferType<typeof SignInSchema>;

const emptySignInSchema: SignInType = {
  email: "",
  password: "",
  confirmPassword: "",
};

interface RegisterResponse {
  error: boolean;
  message: string;
  data?: {
    token: string;
  };
}

export { SignInSchema, emptySignInSchema, SignInType, RegisterResponse };
