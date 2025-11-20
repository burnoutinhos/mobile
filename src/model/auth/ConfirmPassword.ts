import * as yup from "yup";

const ConfirmPasswordSchema = yup.object().shape({
  password: yup.string().required("Senha é obrigatória"),
});

type ConfirmPasswordType = yup.InferType<typeof ConfirmPasswordSchema>;

const emptyLoginForm: ConfirmPasswordType = {
  password: "",
};

type ConfirmPasswordResponse = {
  validPassword: boolean;
}

export { ConfirmPasswordSchema, ConfirmPasswordType, emptyLoginForm, ConfirmPasswordResponse };
