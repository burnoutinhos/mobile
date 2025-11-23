import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { FormikProps } from "formik";
import { useAuth } from "../../../context/AuthProvider";
import { usePreferences } from "../../../context/ThemeProvider";
import { AuthResponse } from "../../../model/auth/types";
import { ErrorResponseDTO } from "../../../model/types";
import { IUser } from "../../../model/user/user";
import { UserType } from "../../../model/user/UserTypes";
import api from "../../../services/api";
import { endpoints } from "../../../services/api/endpoints";
import { queryKeys } from "../../../services/api/query-keys";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const useFormEditUser = (user: IUser) => {
  const { theme } = usePreferences();
  const formikRef = useRef<FormikProps<UserType> | null>(null);

  const [update, setUpdate] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [confirmEditVisible, setConfirmEditVisible] = useState<boolean>(false);

  const { login } = useAuth();

  const { isPending, error, data, mutate, reset } = useMutation<
    AxiosResponse<AuthResponse>,
    AxiosError<ErrorResponseDTO>,
    Omit<UserType, "confirmPassword">
  >({
    mutationKey: [queryKeys.user.user],
    mutationFn: async (form: Omit<UserType, "confirmPassword">) =>
      await api.put(endpoints.user.update, form),
    onSuccess: (data) => {
      login(data.data.token);
      setUpdate(false);
    },
  });

  const handleSubmit = (values: UserType) => {
    console.log("🔍 FormEditUser - onSubmit chamado");
    console.log("🔍 Valores:", values);

    // Cria o payload apenas com os campos que queremos editar
    const payload: any = {
      name: values.name,
      email: values.email,
    };

    // Adiciona password apenas se foi preenchido
    if (values.password && values.password.trim() !== "") {
      payload.password = values.password;
    }

    console.log("📤 Payload final:", payload);
    mutate(payload);
  };

  return {
    // Refs
    formikRef,

    // States
    update,
    setUpdate,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    confirmEditVisible,
    setConfirmEditVisible,

    // Theme
    theme,

    // Mutation
    isPending,
    error,
    data,
    mutate,
    reset,

    // Data
    user,

    // Actions
    handleSubmit,
  };
};
