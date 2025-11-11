import * as yup from "yup";

const RegisterSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
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

type RegisterType = yup.InferType<typeof RegisterSchema>;

const emptyRegisterForm: RegisterType = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export { RegisterSchema, emptyRegisterForm, RegisterType };
