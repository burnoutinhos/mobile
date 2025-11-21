import { Formik } from "formik";
import { CustomModal } from "../../../components/Modal";
import {
  ConfirmPasswordResponse,
  ConfirmPasswordSchema,
  ConfirmPasswordType,
} from "../../../model/auth/ConfirmPassword";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
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
  setFieldValue
}: Props) => {
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
    mutationFn: async ({ password }: ConfirmPasswordType) =>
      {
        const response : AxiosResponse<ConfirmPasswordResponse> = await api.get(endpoints.user.verifyPassword, {
          params: { password: password },
        });
        return {
          password: password
        } as ConfirmPasswordType;
      },
    onSuccess: (data) => {
      setConfirmEditVisible(false);
      setUpdate(true);
      setFieldValue('password', data.password);
      setFieldValue('confirmPassword', data.password);
    },
  });

  const { theme } = usePreferences();

  return (
    <CustomModal
      title="Confirme sua senha para editar o email"
      visible={confirmEditVisible}
      onDismiss={() => setConfirmEditVisible(false)}
      children={
        <Formik
          initialValues={{ password: "" }}
          onSubmit={(values) => {
            confirmPassword(values)
            setConfirmEditVisible(false);
            setUpdate(true);
          }}
          validationSchema={ConfirmPasswordSchema}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <View
              style={{
                padding: 20,
                backgroundColor: theme.colors.background,
                borderRadius: 8,
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3,
                elevation: 5,
                gap: 10,
              }}
            >
              <TextInput
                label="Senha"
                value={values.password}
                onChangeText={handleChange("password")}
                style={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  fontSize: 16,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.onBackground,
                  shadowColor: theme.colors.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3,
                  elevation: 5,
                }}
                secureTextEntry
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
                Confirmar
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
