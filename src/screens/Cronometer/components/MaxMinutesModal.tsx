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
import { MaxMinutesSchema } from "../../../model/timeblocks/Timeblock";

interface Props {
  setMaxMinutes: (minutes: number) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const MaxMinutesModal = ({
  visible,
  setVisible,
  setMaxMinutes,
}: Props) => {
  const { theme } = usePreferences();

  return (
    <CustomModal
      title="Qual é o tempo máximo em minutos?"
      visible={visible}
      onDismiss={() => setVisible(false)}
      children={
        <Formik
          initialValues={{ max: 0 }}
          onSubmit={(values) => {
            console.log("skamdkasmkldmask");
            setMaxMinutes(values.max);
            setVisible(false)
          }}
          validationSchema={MaxMinutesSchema}
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
                label="Tempo máximo"
                onChangeText={handleChange("max")}
                onBlur={handleBlur("max")}
                placeholder="Digite sua senha"
                value={values.max.toString()}
                mode="outlined"
                error={!!(errors.max && touched.max)}
                keyboardType="numeric"
                left={<TextInput.Icon icon="lock" />}
              />

              {errors.max && (
                <Text
                  style={{
                    color: theme.colors.error,
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  {errors.max}
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
