import { useEffect, useRef } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { FormikProps } from "formik";
import { useAuth } from "../../../context/AuthProvider";
import { usePreferences } from "../../../context/ThemeProvider";
import { RegisterType } from "../../../model/auth/RegisterTypes";
import { AuthResponse } from "../../../model/auth/types";
import { ErrorResponseDTO } from "../../../model/types";
import { AuthParamList } from "../../../navigators/AuthNavigator";
import api from "../../../services/api";
import { endpoints } from "../../../services/api/endpoints";

export const useRegister = () => {
  const { theme } = usePreferences();
  const formikRef = useRef<FormikProps<RegisterType> | null>(null);
  const emailInputRef = useRef<any | null>(null);
  const { login } = useAuth();

  const navigation = useNavigation<NavigationProp<AuthParamList>>();

  let { isPending, error, data, mutate } = useMutation<
    AxiosResponse<AuthResponse>,
    AxiosError<ErrorResponseDTO>,
    Omit<RegisterType, "confirmPassword">
  >({
    mutationKey: ["register"],
    mutationFn: async (form) =>
      await api.post(endpoints.auth.register, form, {
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
      formikRef.current?.setFieldTouched("confirmPassword", false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [data]);

  const handleSubmit = (values: RegisterType) => {
    const { confirmPassword, ...request } = values;
    mutate(request);
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
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
    navigateToLogin,
  };
};
