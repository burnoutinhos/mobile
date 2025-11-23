import * as yup from "yup";

const getLoginSchema = (t: (key: string) => string) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
    password: yup.string().required(t("validation.passwordRequired")),
  });

type LoginType = {
  email: string;
  password: string;
};

const emptyLoginForm: LoginType = {
  email: "",
  password: "",
};

export { getLoginSchema, LoginType, emptyLoginForm };
