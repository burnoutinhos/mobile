import { Formik, FormikProps } from "formik";
import React, { useRef, useState } from "react";
import { usePreferences } from "../context/ThemeProvider";
import { UserSchema, UserType } from "../model/user/UserTypes";
import { IUser } from "../model/user/user";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { endpoints } from "../services/api/endpoints";
import api from "../services/api";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  Card,
  IconButton,
  Divider,
  Banner,
} from "react-native-paper";
import { queryKeys } from "../services/api/query-keys";
import { ErrorResponseDTO } from "../model/types";
import { AuthResponse } from "../model/auth/types";
import { useAuth } from "../context/AuthProvider";

interface FormProps {
  user: IUser;
}

export default function FormEditUser({ user }: FormProps) {
  const { theme } = usePreferences();
  const formikRef = useRef<FormikProps<UserType> | null>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const { login } = useAuth();

  let { isPending, error, data, mutate, reset } = useMutation<
    AxiosResponse<AuthResponse>,
    AxiosError<ErrorResponseDTO>,
    UserType
  >({
    mutationKey: [queryKeys.user.user],
    mutationFn: async (form: UserType) =>
      await api.put(endpoints.user.update, form),
    onSuccess: (data) => {
      login(data.data.token);
      setUpdate(false);
    },
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={user as UserType}
      onSubmit={(values: UserType) => mutate(values)}
      validationSchema={UserSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        resetForm,
      }) => (
        <View style={styles.container}>
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <Card.Title
              title="Informações do Perfil"
              titleVariant="titleLarge"
              titleStyle={{ color: theme.colors.onSurface, fontWeight: "700" }}
              left={(props) => (
                <IconButton
                  {...props}
                  icon="account-edit"
                  iconColor={theme.colors.primary}
                />
              )}
            />
            <Divider />
            <Card.Content style={styles.cardContent}>
              {/* Campo Nome */}
              <View style={styles.inputContainer}>
                <Text
                  variant="labelLarge"
                  style={[styles.label, { color: theme.colors.onSurface }]}
                >
                  Nome
                </Text>
                <TextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  placeholder="Digite seu nome"
                  value={values.name}
                  mode="outlined"
                  disabled={!update}
                  left={<TextInput.Icon icon="account" forceTextInputFocus={false} />}
                  error={!!(errors.name && touched.name)}
                  textColor={theme.colors.background}
                  style={{backgroundColor: theme.colors.onBackground, color: theme.colors.background}}
                />
                {errors.name && touched.name && (
                  <Text
                    variant="bodySmall"
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.name}
                  </Text>
                )}
              </View>

              {/* Campo Email */}
              <View style={styles.inputContainer}>
                <Text
                  variant="labelLarge"
                  style={[styles.label, { color: theme.colors.onSurface }]}
                >
                  Email
                </Text>
                <TextInput
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  placeholder="Digite seu email"
                  value={values.email}
                  mode="outlined"
                  disabled={!update}
                  left={<TextInput.Icon icon="email" forceTextInputFocus={false} />}
                  error={!!(errors.email && touched.email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textColor={theme.colors.background}
                  style={{backgroundColor: theme.colors.onBackground, color: theme.colors.background}}
                />
                {errors.email && touched.email && (
                  <Text
                    variant="bodySmall"
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.email}
                  </Text>
                )}
              </View>

              {/* Campo Senha */}
              {update && (
                <>
                  <View style={styles.inputContainer}>
                    <Text
                      variant="labelLarge"
                      style={[styles.label, { color: theme.colors.onSurface }]}
                    >
                      Nova Senha
                    </Text>
                    <TextInput
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder="Digite sua nova senha"
                      value={values.password}
                      mode="outlined"
                      disabled={!update}
                      secureTextEntry={!showPassword}
                      left={<TextInput.Icon icon="lock" />}
                      right={
                        <TextInput.Icon
                          icon={showPassword ? "eye-off" : "eye"}
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      }
                      error={!!(errors.password && touched.password)}
                      textColor={theme.colors.background}
                      style={{backgroundColor: theme.colors.onBackground, color: theme.colors.background}}
                    />
                    {errors.password && touched.password && (
                      <Text
                        variant="bodySmall"
                        style={[
                          styles.errorText,
                          { color: theme.colors.error },
                        ]}
                      >
                        {errors.password}
                      </Text>
                    )}
                  </View>

                  {/* Campo Confirmar Senha */}
                  <View style={styles.inputContainer}>
                    <Text
                      variant="labelLarge"
                      style={[styles.label, { color: theme.colors.onSurface }]}
                    >
                      Confirmar Senha
                    </Text>
                    <TextInput
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      placeholder="Confirme sua senha"
                      value={values.confirmPassword}
                      mode="outlined"
                      disabled={!update}
                      secureTextEntry={!showConfirmPassword}
                      left={<TextInput.Icon icon="lock-check" />}
                      right={
                        <TextInput.Icon
                          icon={showConfirmPassword ? "eye-off" : "eye"}
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        />
                      }
                      error={
                        !!(errors.confirmPassword && touched.confirmPassword)
                      }
                      textColor={theme.colors.background}
                      style={{backgroundColor: theme.colors.onBackground, color: theme.colors.background}}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <Text
                        variant="bodySmall"
                        style={[
                          styles.errorText,
                          { color: theme.colors.error },
                        ]}
                      >
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>
                </>
              )}

              {/* Botões de Ação */}
              <View style={styles.buttonContainer}>
                {update ? (
                  <>
                    <Button
                      mode="contained"
                      onPress={() => handleSubmit()}
                      style={[
                        styles.button,
                        // { backgroundColor: theme.colors.primary, flex: 1 },
                      ]}
                      labelStyle={styles.buttonLabel}
                      contentStyle={styles.buttonContent}
                      icon="check"
                      disabled={isPending}
                    >
                      Salvar
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        setUpdate(false);
                        resetForm();
                        reset();
                      }}
                      style={[styles.button, { flex: 1 }]}
                      labelStyle={styles.buttonLabel}
                      contentStyle={styles.buttonContent}
                      icon="close"
                      disabled={isPending}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    mode="contained"
                    onPress={() => setUpdate(true)}
                    style={[
                      styles.button,
                    ]}
                    labelStyle={styles.buttonLabel}
                    contentStyle={styles.buttonContent}
                    icon="pencil"
                  >
                    Editar Perfil
                  </Button>
                )}
              </View>

              {/* Loading */}
              {isPending && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurface, marginTop: 8 }}
                  >
                    Atualizando perfil...
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Mensagem de Sucesso */}
          {data && (
            <Banner
              visible={!!data}
              actions={[
                {
                  label: "OK",
                  onPress: () => reset(),
                },
              ]}
              icon="check-circle"
              style={{
                backgroundColor: theme.colors.primaryContainer,
                marginTop: 16,
              }}
            >
              <Text style={{ color: theme.colors.onPrimaryContainer }}>
                {data.data.message}
              </Text>
            </Banner>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <Banner
              visible={!!error}
              actions={[
                {
                  label: "Fechar",
                  onPress: () => reset(),
                },
              ]}
              icon="alert-circle"
              style={{
                backgroundColor: theme.colors.errorContainer,
                marginTop: 16,
              }}
            >
              <Text style={{ color: theme.colors.onErrorContainer }}>
                {error.message}
              </Text>
            </Banner>
          )}
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardContent: {
    paddingTop: 16,
    gap: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontWeight: "600",
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    justifyContent: 'center'
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 16,
  },
});
