import { Formik } from "formik";
import { CustomModal } from "../../../components/Modal";
import {
  ConfirmPasswordResponse,
  ConfirmPasswordSchema,
  ConfirmPasswordType,
} from "../../../model/auth/ConfirmPassword";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { usePreferences } from "../../../context/ThemeProvider";
import { endpoints } from "../../../services/api/endpoints";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { queryKeys } from "../../../services/api/query-keys";
import api from "../../../services/api";

interface Props {
  confirmEditVisible: boolean;
  setConfirmEditVisible: (visible: boolean) => void;
  setUpdate: (update: boolean) => void;
  setFieldValue: (field: string, value: any) => void;
}

const ConfirmPasswordToEdit = ({
  confirmEditVisible,
  setConfirmEditVisible,
  setUpdate,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();
  const {
    isPending: isPasswordPending,
    isError: isPasswordError,
    data: passwordData,
    mutate: confirmPassword,
  } = useMutation<
    ConfirmPasswordType,
    ConfirmPasswordResponse,
    ConfirmPasswordType
  >({
    mutationKey: [queryKeys.user.userPassword],
    mutationFn: async ({ password }: ConfirmPasswordType) => {
      await api.get(endpoints.user.verifyPassword, {
        params: { password: password },
      });
      return {
        password: password,
      } as ConfirmPasswordType;
    },
    onSuccess: (data) => {
      setConfirmEditVisible(false);
      setFieldValue("password", data.password);
      setFieldValue("confirmPassword", data.password);
      setUpdate(true);
    },
  });

  const { theme } = usePreferences();

  return (
    <CustomModal
      title={t("user.confirmPasswordTitle")}
      visible={confirmEditVisible}
      onDismiss={() => setConfirmEditVisible(false)}
      i18nIsDynamicList
      children={
        <Formik
          initialValues={{ password: "" }}
          onSubmit={(values) => {
            confirmPassword(values);
            setConfirmEditVisible(false);
            setUpdate(true);
          }}
          validationSchema={ConfirmPasswordSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View
              style={{
                paddingHorizontal: 20,
                borderRadius: 8,
                paddingBottom: 20,
                gap: 10,
              }}
            >
              <TextInput
                label={t("user.password")}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                style={{
                  backgroundColor: theme.colors.background,
                }}
                textColor={theme.colors.text}
                placeholder={t("user.passwordPlaceholder")}
                value={values.password}
                mode="outlined"
                error={!!(errors.password && touched.password)}
                secureTextEntry
                left={<TextInput.Icon icon="lock" />}
              />

              {errors.password && (
                <Text
                  style={{
                    color: theme.colors.error,
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  {errors.password}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                style={[styles.button]}
                labelStyle={styles.buttonLabel}
              >
                {t("user.confirm")}
              </Button>
            </View>
          )}
        </Formik>
      }
    />
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ConfirmPasswordToEdit;
