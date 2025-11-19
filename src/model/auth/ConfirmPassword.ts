import * as yup from "yup";

const ConfirmPasswordSchema = yup.object().shape({
  password: yup.string().required("Senha é obrigatória"),
});

type ConfirmPasswordType = yup.InferType<typeof ConfirmPasswordSchema>;

const emptyLoginForm: ConfirmPasswordType = {
  password: "",
};

export { ConfirmPasswordSchema, ConfirmPasswordType, emptyLoginForm };
