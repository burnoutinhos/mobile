import { Formik } from "formik";
import React from "react";
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
import { useTranslation } from "react-i18next";
import ConfirmPasswordToEdit from "../components/ConfirmPasswordToEdit";
import { IUser } from "../../../model/user/user";
import { UserType, UserEditSchema } from "../../../model/user/UserTypes";
import { useFormEditUser } from "../controllers/FormEditUserController";

interface FormProps {
  user: IUser;
}

export default function FormEditUser({ user }: FormProps) {
  const { t } = useTranslation();
  const {
    formikRef,
    update,
    setUpdate,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    confirmEditVisible,
    setConfirmEditVisible,
    theme,
    isPending,
    error,
    data,
    reset,
    handleSubmit,
  } = useFormEditUser(user);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ ...user, password: "", confirmPassword: "" } as UserType}
      onSubmit={handleSubmit}
      validationSchema={UserEditSchema}
    >
      {({
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        resetForm,
        setFieldValue,
      }) => (
        <View style={styles.container}>
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <Card.Title
              title={t("user.profileInfo")}
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
                  {t("user.name")}
                </Text>
                <TextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  placeholder={t("user.namePlaceholder")}
                  value={values.name}
                  mode="outlined"
                  disabled={!update}
                  left={
                    <TextInput.Icon
                      icon="account"
                      forceTextInputFocus={false}
                      color={theme.colors.onBackground}
                    />
                  }
                  style={{
                    backgroundColor: theme.colors.background,
                  }}
                  textColor={theme.colors.onBackground}
                  error={!!(errors.name && touched.name)}
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
                  {t("user.email")}
                </Text>
                <TextInput
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  placeholder={t("user.emailPlaceholder")}
                  value={values.email}
                  mode="outlined"
                  disabled={!update}
                  left={
                    <TextInput.Icon
                      icon="email"
                      forceTextInputFocus={false}
                      color={theme.colors.onBackground}
                    />
                  }
                  style={{
                    backgroundColor: theme.colors.background,
                  }}
                  textColor={theme.colors.onBackground}
                  error={!!(errors.email && touched.email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                      {t("user.newPassword")}
                    </Text>
                    <TextInput
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder={t("user.newPasswordPlaceholder")}
                      value={values.password}
                      mode="outlined"
                      disabled={!update}
                      secureTextEntry={!showPassword}
                      left={
                        <TextInput.Icon
                          icon="lock"
                          color={theme.colors.onBackground}
                        />
                      }
                      right={
                        <TextInput.Icon
                          icon={showPassword ? "eye-off" : "eye"}
                          onPress={() => setShowPassword(!showPassword)}
                          color={theme.colors.onBackground}
                        />
                      }
                      style={{
                        backgroundColor: theme.colors.background,
                      }}
                      textColor={theme.colors.onBackground}
                      error={!!(errors.password && touched.password)}
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
                      {t("user.confirmPassword")}
                    </Text>
                    <TextInput
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      placeholder={t("user.confirmPasswordPlaceholder")}
                      value={values.confirmPassword}
                      mode="outlined"
                      disabled={!update}
                      secureTextEntry={!showConfirmPassword}
                      left={
                        <TextInput.Icon
                          icon="lock-check"
                          color={theme.colors.onBackground}
                        />
                      }
                      right={
                        <TextInput.Icon
                          icon={showConfirmPassword ? "eye-off" : "eye"}
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          color={theme.colors.onBackground}
                        />
                      }
                      style={{
                        backgroundColor: theme.colors.background,
                      }}
                      textColor={theme.colors.onBackground}
                      error={
                        !!(errors.confirmPassword && touched.confirmPassword)
                      }
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
                      onPress={() => handleSubmit(values)}
                      style={styles.button}
                      labelStyle={styles.buttonLabel}
                      contentStyle={styles.buttonContent}
                      icon="check"
                      loading={isPending}
                      disabled={isPending}
                    >
                      {t("user.save")}
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
                      {t("user.cancel")}
                    </Button>
                  </>
                ) : (
                  <Button
                    mode="contained"
                    onPress={() => {
                      setConfirmEditVisible(true);
                    }}
                    style={[styles.button]}
                    labelStyle={styles.buttonLabel}
                    contentStyle={styles.buttonContent}
                    icon="pencil"
                  >
                    {t("user.editProfile")}
                  </Button>
                )}
              </View>

              <ConfirmPasswordToEdit
                confirmEditVisible={confirmEditVisible}
                setConfirmEditVisible={setConfirmEditVisible}
                setUpdate={setUpdate}
                setFieldValue={setFieldValue}
              />

              {isPending && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurface, marginTop: 8 }}
                  >
                    {t("user.updating")}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>

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

          {error && (
            <Banner
              visible={!!error}
              actions={[
                {
                  label: t("user.cancel"),
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
    justifyContent: "center",
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
