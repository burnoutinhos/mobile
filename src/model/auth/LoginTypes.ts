import * as yup from "yup";

const LoginSchema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

type LoginType = yup.InferType<typeof LoginSchema>;

const emptyLoginForm: LoginType = {
  email: "",
  password: "",
};

export { LoginSchema, LoginType, emptyLoginForm };
