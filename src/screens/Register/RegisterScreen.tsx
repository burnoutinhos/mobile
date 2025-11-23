import { Formik } from "formik";
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
import {
  RegisterType,
  emptyRegisterForm,
  getRegisterSchema,
} from "../../model/auth/RegisterTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegister } from "./controllers/RegisterController";
import { useTranslation } from "react-i18next";

const RegisterScreen = () => {
  const { t } = useTranslation();
  const {
    formikRef,
    emailInputRef,
    theme,
    isPending,
    error,
    data,
    handleSubmit,
    navigateToLogin,
  } = useRegister();

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
            onSubmit={handleSubmit}
            validationSchema={getRegisterSchema(t)}
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
                  {t("register.title")}
                </Text>

                <Text
                  variant="bodyLarge"
                  style={[
                    styles.subtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {t("register.subtitle")}
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
                      label={t("register.name")}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      placeholder={t("register.namePlaceholder")}
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
                      label={t("register.email")}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder={t("register.emailPlaceholder")}
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
                      label={t("register.password")}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder={t("register.passwordPlaceholder")}
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
                      label={t("register.confirmPassword")}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      placeholder={t("register.confirmPasswordPlaceholder")}
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
                  {t("register.createButton")}
                </Button>

                <Button
                  mode="text"
                  onPress={navigateToLogin}
                  style={styles.linkButton}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  {t("register.hasAccount")}
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
