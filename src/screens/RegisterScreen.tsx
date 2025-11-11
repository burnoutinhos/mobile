import { useEffect, useRef } from "react";
import { Formik, FormikProps } from "formik";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { usePreferences } from "../context/ThemeProvider";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { AxiosError, AxiosResponse } from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { endpoints } from "../services/api/endpoints";
import { AuthResponse } from "../model/auth/types";
import {
  emptyRegisterForm,
  RegisterSchema,
  RegisterType,
} from "../model/auth/RegisterTypes";

const RegisterScreen = () => {
  const { theme } = usePreferences();
  const formikRef = useRef<FormikProps<RegisterType> | null>(null);
  const emailInputRef = useRef<any | null>(null);

  let { isPending, error, data, mutate } = useMutation<
    AxiosResponse<AuthResponse>,
    AxiosError<AuthResponse>,
    RegisterType
  >({
    mutationKey: ["register"],
    mutationFn: async (form: RegisterType) =>
      await api.post(endpoints.auth.register, form, {
        headers: { "x-skip-auth": true },
      }),
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

  return (
    <Formik
      innerRef={formikRef}
      initialValues={emptyRegisterForm}
      onSubmit={(values: RegisterType) => mutate(values)}
      validationSchema={RegisterSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text
            theme={theme}
            style={[styles.label, { color: theme.colors.onBackground }]}
          >
            Nome
          </Text>

          <TextInput
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            placeholder="Digite o seu nome"
            value={values.name}
            mode="outlined"
            style={[
              styles.input,
              errors.name && touched.name
                ? {
                    borderColor: theme.colors.error,
                    borderWidth: 2,
                  }
                : undefined,
            ]}
            theme={{ colors: { text: theme.colors.onBackground } }}
          />

          {errors.name && touched.name && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.name}
            </Text>
          )}

          <Text
            theme={theme}
            style={[styles.label, { color: theme.colors.onBackground }]}
          >
            Email
          </Text>

          <TextInput
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            placeholder="Digite o email"
            value={values.email}
            mode="outlined"
            ref={emailInputRef}
            style={[
              styles.input,
              errors.email && touched.email
                ? {
                    borderColor: theme.colors.error,
                    borderWidth: 2,
                  }
                : undefined,
            ]}
            theme={{ colors: { text: theme.colors.onBackground } }}
          />

          {errors.email && touched.email && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.email}
            </Text>
          )}

          <Text
            theme={theme}
            style={[styles.label, { color: theme.colors.onBackground }]}
          >
            Senha
          </Text>

          <TextInput
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            placeholder="Digite sua senha"
            value={values.password}
            mode="outlined"
            style={[
              styles.input,
              errors.password && touched.password
                ? {
                    borderColor: theme.colors.error,
                    borderWidth: 2,
                  }
                : undefined,
            ]}
            theme={{ colors: { text: theme.colors.onBackground } }}
          />

          {errors.password && touched.password && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.password}
            </Text>
          )}

          <Text
            theme={theme}
            style={[styles.label, { color: theme.colors.onBackground }]}
          >
            Confirmar Senha
          </Text>

          <TextInput
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            placeholder="Confirme sua senha"
            value={values.confirmPassword}
            mode="outlined"
            style={[
              styles.input,
              errors.confirmPassword && touched.confirmPassword
                ? {
                    borderColor: theme.colors.error,
                    borderWidth: 2,
                  }
                : undefined,
            ]}
            theme={{ colors: { text: theme.colors.onBackground } }}
          />

          {errors.confirmPassword && touched.confirmPassword && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.confirmPassword}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={() => handleSubmit()}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            labelStyle={[styles.buttonLabel, { color: theme.colors.onPrimary }]}
            contentStyle={styles.buttonContent}
          >
            Registrar
          </Button>

          {isPending && <ActivityIndicator size="large" />}
          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error.message}
            </Text>
          )}
          {data && (
            <Text
              style={[
                styles.label,
                { color: "green", fontSize: 18, textAlign: "center" },
              ]}
            >
              {data.data.message}
            </Text>
          )}
        </SafeAreaView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    flex: 1,
  },
  label: {
    fontSize: 16,
    paddingVertical: 4,
  },
  input: {
    marginTop: 8,
    marginBottom: 4,
  },
  errorText: {
    paddingVertical: 4,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 4,
    marginVertical: 8,
    borderRadius: 6,
  },
  buttonContent: {
    height: 44,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterScreen;
