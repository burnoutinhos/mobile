import { useEffect, useRef } from "react";
import { Formik, FormikProps } from "formik";
import { Button, Text, TextInput, Card, HelperText } from "react-native-paper";
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
  emptyLoginForm,
  LoginSchema,
  LoginType,
} from "../model/auth/LoginTypes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthParamList } from "../navigators/AuthNavigator";
import { ErrorResponseDTO } from "../model/types";
import { useAuth } from "../context/AuthProvider";

const LoginScreen = () => {
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
            initialValues={emptyLoginForm}
            onSubmit={(values: LoginType) => mutate(values)}
            validationSchema={LoginSchema}
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
                  variant="headlineLarge"
                  style={[styles.title, { color: theme.colors.primary }]}
                >
                  Bem-vindo de volta!
                </Text>

                <Text
                  variant="bodyLarge"
                  style={[
                    styles.subtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Entre com suas credenciais para acessar
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
                      placeholder="Digite sua senha"
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
                  </Card.Content>
                </Card>

                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  icon="login"
                  loading={isPending}
                  disabled={isPending}
                >
                  Entrar
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate("Register")}
                  style={styles.linkButton}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  Sem conta? Cadastre-se
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

export default LoginScreen;
