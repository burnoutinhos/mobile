import * as yup from "yup";

const getRegisterSchema = (t: (key: string) => string) =>
  yup.object().shape({
    name: yup.string().required(t("validation.nameRequired")),
    email: yup
      .string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
    password: yup
      .string()
      .min(8, t("validation.passwordMinLength"))
      .required(t("validation.passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), undefined],
        t("validation.passwordsMustMatch"),
      )
      .required(t("validation.confirmPasswordRequired")),
  });

type RegisterType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const emptyRegisterForm: RegisterType = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export { getRegisterSchema, emptyRegisterForm, RegisterType };
