import { Formik, FormikProps } from "formik";
import { TodoSchema, TodoType } from "../model/todo/TodoTypes";
import { usePreferences } from "../context/ThemeProvider";
import { useRef, useState } from "react";
import { ITodo } from "../model/todo/todo";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { endpoints } from "../services/api/endpoints";
import api from "../services/api";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Button,
  Menu,
  Text,
  TextInput,
} from "react-native-paper";
import DatePicker from "@dietime/react-native-date-picker";
import { EnumTypeTodo } from "../services/Enums";

const FormEditTodo = ({ todo }: { todo: ITodo }) => {
  const { theme } = usePreferences();
  const formikRef = useRef<FormikProps<TodoType> | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const typeOptions = [
    { label: "Tarefa", value: EnumTypeTodo.TODO },
    { label: "Modo Foco", value: EnumTypeTodo.FOCUS_MODE },
    { label: "Descanso", value: EnumTypeTodo.REST },
  ];

  let { isPending, error, data, mutate } = useMutation<
    AxiosResponse<ITodo>,
    AxiosError<ITodo>,
    TodoType
  >({
    mutationKey: ["todoUpdate"],
    mutationFn: async (form: TodoType) =>
      await api.put(endpoints.todo.put + `/${todo.id}`, form, {
        headers: { "x-skip-auth": true },
      }),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={todo as TodoType}
      onSubmit={(values: TodoType) => mutate(values)}
      validationSchema={TodoSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text
            theme={theme}
            style={[styles.label, { color: theme.colors.onBackground }]}
          >
            Nome
          </Text>

          <TextInput
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            placeholder="Digite o nome"
            value={values.name}
            mode="outlined"
            style={[
              styles.input,
              errors.name && touched.name
                ? {
                    borderColor: theme.colors.error,
                    borderWidth: 2,
                  }
                : undefined,
            ]}
            theme={{ colors: { text: theme.colors.onBackground } }}
          />

          {errors.name && touched.name && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.name}
            </Text>
          )}

          <Text
            theme={theme}
            style={[styles.label, { color: theme.colors.onBackground }]}
          >
            Email
          </Text>

          <TextInput
            onChangeText={handleChange("description")}
            onBlur={handleBlur("description")}
            placeholder="Digite a descrição"
            value={values.description}
            mode="outlined"
            style={[
              styles.input,
              errors.description && touched.description
                ? {
                    borderColor: theme.colors.error,
                    borderWidth: 2,
                  }
                : undefined,
            ]}
            theme={{ colors: { text: theme.colors.onBackground } }}
          />

          {errors.description && touched.description && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.description}
            </Text>
          )}

          <Text
            theme={theme}
            style={[styles.label, { color: theme.colors.onBackground }]}
          >
            Tipo de Tarefa
          </Text>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.selectButton}
                contentStyle={styles.selectButtonContent}
              >
                {typeOptions.find((opt) => opt.value === values.type)?.label ||
                  "Selecione o tipo"}
              </Button>
            }
          >
            {typeOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  setFieldValue("type", option.value);
                  setMenuVisible(false);
                }}
                title={option.label}
              />
            ))}
          </Menu>

          {errors.type && touched.type && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.type}
            </Text>
          )}

          <View style={styles.dateContainer}>
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.onSurface }}
            >
              Data de início
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowStartPicker(true)}
              style={styles.dateButton}
            >
              {values.start?.toLocaleDateString()}
            </Button>
            {showStartPicker && (
              <DatePicker
                value={values.start ? new Date(values.start) : new Date()}
                onChange={(date) => {
                  setFieldValue("start", date);
                  setShowStartPicker(false);
                }}
              />
            )}
          </View>

          <View style={styles.dateContainer}>
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.onSurface }}
            >
              Data de término
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowEndPicker(true)}
              style={styles.dateButton}
            >
              {values.end
                ? new Date(values.end).toLocaleDateString()
                : "Selecione"}
            </Button>
            {showEndPicker && (
              <DatePicker
                value={values.end ? new Date(values.end) : new Date()}
                onChange={(date) => {
                  setFieldValue("end", date);
                  setShowEndPicker(false);
                }}
              />
            )}
          </View>

          <Button
            mode="contained"
            onPress={() => handleSubmit()}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            labelStyle={[styles.buttonLabel, { color: theme.colors.onPrimary }]}
            contentStyle={styles.buttonContent}
          >
            Atualizar tarefa
          </Button>

          {isPending && <ActivityIndicator size="large" />}
          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error.message}
            </Text>
          )}
        </SafeAreaView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    flex: 1,
  },
  label: {
    fontSize: 16,
    paddingVertical: 4,
  },
  input: {
    marginTop: 8,
    marginBottom: 4,
  },
  errorText: {
    paddingVertical: 4,
    marginBottom: 8,
  },
  dateContainer: {
    gap: 8,
    marginBottom: 8,
  },
  dateButton: {
    alignSelf: "flex-start",
  },
  button: {
    paddingVertical: 4,
    marginVertical: 8,
    borderRadius: 6,
  },
  selectButton: {
    marginTop: 8,
    marginBottom: 4,
    justifyContent: "flex-start",
  },
  selectButtonContent: {
    height: 56,
    justifyContent: "flex-start",
  },
  buttonContent: {
    height: 44,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FormEditTodo;
