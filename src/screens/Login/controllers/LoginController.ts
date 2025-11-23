import { useEffect, useRef } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { FormikProps } from "formik";
import { useAuth } from "../../../context/AuthProvider";
import { usePreferences } from "../../../context/ThemeProvider";
import { LoginType } from "../../../model/auth/LoginTypes";
import { AuthResponse } from "../../../model/auth/types";
import { ErrorResponseDTO } from "../../../model/types";
import { AuthParamList } from "../../../navigators/AuthNavigator";
import api from "../../../services/api";
import { endpoints } from "../../../services/api/endpoints";

export const useLogin = () => {
  const { theme } = usePreferences();
  const formikRef = useRef<FormikProps<LoginType> | null>(null);
  const emailInputRef = useRef<any | null>(null);
  const { login } = useAuth();

  const navigation = useNavigation<NavigationProp<AuthParamList>>();

  let { isPending, error, data, mutate } = useMutation<
    AxiosResponse<AuthResponse>,
    AxiosError<ErrorResponseDTO>,
    LoginType
  >({
    mutationKey: ["login"],
    mutationFn: async (form: LoginType) =>
      await api.post(endpoints.auth.login, form, {
        headers: { "x-skip-auth": true },
      }),
    onSuccess: (response) => {
      login(response.data.token);
    },
  });

  useEffect(() => {
    if (!data) return;

    const timeout = setTimeout(() => {
      formikRef.current?.resetForm();
      data = undefined;
      emailInputRef.current?.focus?.();
      formikRef.current?.setFieldTouched("password", false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [data]);

  const handleSubmit = (values: LoginType) => {
    mutate(values);
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  return {
    // Refs
    formikRef,
    emailInputRef,

    // Theme
    theme,

    // Mutation
    isPending,
    error,
    data,

    // Navigation
    navigation,

    // Actions
    handleSubmit,
    navigateToRegister,
  };
};
