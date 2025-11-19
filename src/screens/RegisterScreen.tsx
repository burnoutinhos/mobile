import { useEffect, useRef } from "react";
import { Formik, FormikProps } from "formik";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  Card,
  HelperText,
} from "react-native-paper";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthParamList } from "../navigators/AuthNavigator";
import { ErrorResponseDTO } from "../model/types";
import { useAuth } from "../context/AuthProvider";

const RegisterScreen = () => {
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            innerRef={formikRef}
            initialValues={emptyRegisterForm}
            onSubmit={(values: RegisterType) => {
              const { confirmPassword, ...request } = values;
              mutate(request);
            }}
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
              <View style={styles.formContainer}>
                <Text
                  variant="headlineMedium"
                  style={[styles.title, { color: theme.colors.primary }]}
                >
                  Criar Conta
                </Text>

                <Text
                  variant="bodyLarge"
                  style={[
                    styles.subtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Preencha os dados para se cadastrar
                </Text>

                <Card
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  elevation={2}
                >
                  <Card.Content>
                    <TextInput
                      label="Nome"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      placeholder="Digite seu nome completo"
                      value={values.name}
                      mode="outlined"
                      error={!!(errors.name && touched.name)}
                      style={styles.input}
                      left={<TextInput.Icon icon="account" />}
                    />
                    <HelperText
                      type="error"
                      visible={!!(errors.name && touched.name)}
                    >
                      {errors.name}
                    </HelperText>

                    <TextInput
                      label="Email"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder="seu@email.com"
                      value={values.email}
                      mode="outlined"
                      ref={emailInputRef}
                      error={!!(errors.email && touched.email)}
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      left={<TextInput.Icon icon="email" />}
                    />
                    <HelperText
                      type="error"
                      visible={!!(errors.email && touched.email)}
                    >
                      {errors.email}
                    </HelperText>

                    <TextInput
                      label="Senha"
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder="Crie uma senha segura"
                      value={values.password}
                      mode="outlined"
                      error={!!(errors.password && touched.password)}
                      style={styles.input}
                      secureTextEntry
                      left={<TextInput.Icon icon="lock" />}
                    />
                    <HelperText
                      type="error"
                      visible={!!(errors.password && touched.password)}
                    >
                      {errors.password}
                    </HelperText>

                    <TextInput
                      label="Confirmar Senha"
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      placeholder="Confirme sua senha"
                      value={values.confirmPassword}
                      mode="outlined"
                      error={
                        !!(errors.confirmPassword && touched.confirmPassword)
                      }
                      style={styles.input}
                      secureTextEntry
                      left={<TextInput.Icon icon="lock-check" />}
                    />
                    <HelperText
                      type="error"
                      visible={
                        !!(errors.confirmPassword && touched.confirmPassword)
                      }
                    >
                      {errors.confirmPassword}
                    </HelperText>
                  </Card.Content>
                </Card>

                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  icon="account-plus"
                  loading={isPending}
                  disabled={isPending}
                >
                  Criar Conta
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate("Login")}
                  style={styles.linkButton}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  Já tem uma conta? Faça login
                </Button>

                {error && (
                  <Card
                    style={[
                      styles.messageCard,
                      { backgroundColor: theme.colors.errorContainer },
                    ]}
                  >
                    <Card.Content>
                      <Text style={{ color: theme.colors.onErrorContainer }}>
                        {error.message}
                      </Text>
                    </Card.Content>
                  </Card>
                )}

                {data && (
                  <Card
                    style={[
                      styles.messageCard,
                      { backgroundColor: theme.colors.primaryContainer },
                    ]}
                  >
                    <Card.Content>
                      <Text style={{ color: theme.colors.onPrimaryContainer }}>
                        {data.data.message}
                      </Text>
                    </Card.Content>
                  </Card>
                )}
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 0,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 8,
  },
  messageCard: {
    marginTop: 16,
  },
});

export default RegisterScreen;
