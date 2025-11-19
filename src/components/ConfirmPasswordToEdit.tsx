import { Formik } from "formik";
import { CustomModal } from "./Modal";
import { ConfirmPasswordSchema } from "../model/auth/ConfirmPassword";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { usePreferences } from "../context/ThemeProvider";

interface Props {
  confirmEditVisible: boolean;
  setConfirmEditVisible: (visible: boolean) => void;
  setUpdate: (update: boolean) => void;
}

const ConfirmPasswordToEdit = ({ confirmEditVisible, setConfirmEditVisible, setUpdate }: Props) => {
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
              // logica de confirmar com login e
              // se vier token, logar e atualizar email
              setConfirmEditVisible(false);
              setUpdate(true);
            }}
            validationSchema={ConfirmPasswordSchema}
          >
            {({ handleChange, handleSubmit, values, errors }) => (
              <View style={{
                padding: 20,
                backgroundColor: theme.colors.background,
                borderRadius: 8,
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3,
                elevation: 5,
                gap: 10
              }}>
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
