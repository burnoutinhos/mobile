import { Formik } from "formik";
import {
  Button,
  Text,
  TextInput,
  Card,
  HelperText,
  ActivityIndicator,
} from "react-native-paper";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  LoginType,
  getLoginSchema,
  emptyLoginForm,
} from "../../model/auth/LoginTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "./controllers/LoginController";
import { useTranslation } from "react-i18next";

const LoginScreen = () => {
  const { t } = useTranslation();
  const {
    formikRef,
    emailInputRef,
    theme,
    isPending,
    error,
    data,
    handleSubmit,
    navigateToRegister,
  } = useLogin();

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
            onSubmit={handleSubmit}
            validationSchema={getLoginSchema(t)}
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
                  {t("login.title")}
                </Text>

                <Text
                  variant="bodyLarge"
                  style={[
                    styles.subtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {t("login.subtitle")}
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
                      label={t("login.email")}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder={t("login.emailPlaceholder")}
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
                      label={t("login.password")}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder={t("login.passwordPlaceholder")}
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
                  loading={isPending && !error}
                  disabled={isPending && !error}
                >
                  {t("login.loginButton")}
                </Button>

                {isPending && !error && (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                )}

                <Button
                  mode="text"
                  onPress={navigateToRegister}
                  style={styles.linkButton}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  {t("login.noAccount")}
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
                        {error.status === 404
                          ? t("login.invalidCredentials")
                          : error.message}
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
