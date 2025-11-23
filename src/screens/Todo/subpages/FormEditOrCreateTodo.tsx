import { Formik } from "formik";
import {
  emptyTodoForm,
  getTodoSchema,
  TodoType,
} from "../../../model/todo/TodoTypes";
import { usePreferences } from "../../../context/ThemeProvider";
import { ITodo } from "../../../model/todo/todo";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  HelperText,
  IconButton,
  Menu,
  Text,
  TextInput,
} from "react-native-paper";
import { CustomModal } from "../../../components/Modal";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useFormEditOrCreateTodo } from "../controllers/FormEditOrCreateTodoController";
import { useTranslation } from "react-i18next";

const FormEditOrCreateTodo = ({ todo }: { todo?: ITodo }) => {
  const { t } = useTranslation();
  const { theme } = usePreferences();

  const {
    formikRef,
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    menuVisible,
    setMenuVisible,
    deleteModalVisible,
    setDeleteModalVisible,
    typeOptions,
    isPending,
    error,
    data,
    handleDelete,
    handleConfirmDelete,
    handleSubmit,
    resetUpdate,
    resetCreate,
  } = useFormEditOrCreateTodo(todo);

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
            initialValues={todo ? { ...todo } : emptyTodoForm}
            onSubmit={handleSubmit}
            validationSchema={getTodoSchema(t)}
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
              <View style={styles.formContainer}>
                {/* Header */}
                <View style={styles.header}>
                  <Text
                    variant="headlineMedium"
                    style={{
                      color: theme.colors.primary,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {todo ? t("todo.editTask") : t("todo.newTask")}
                  </Text>
                  <Text
                    variant="bodyLarge"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      textAlign: "center",
                    }}
                  >
                    {todo ? t("todo.updateTaskInfo") : t("todo.fillTaskInfo")}
                  </Text>
                </View>

                {/* Card Principal */}
                <Card
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                  elevation={4}
                >
                  <Card.Content style={styles.cardContent}>
                    {/* Campo Nome */}
                    <View style={styles.inputContainer}>
                      <TextInput
                        label={t("todo.name")}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        placeholder={t("todo.namePlaceholder")}
                        value={values.name}
                        mode="outlined"
                        error={!!(errors.name && touched.name)}
                        left={<TextInput.Icon icon="format-title" />}
                        style={[
                          styles.input,
                          { backgroundColor: theme.colors.surface },
                        ]}
                        textColor={theme.colors.onSurface}
                      />
                      <HelperText
                        type="error"
                        visible={!!(errors.name && touched.name)}
                      >
                        {errors.name}
                      </HelperText>
                    </View>

                    {/* Campo Descrição */}
                    <View style={styles.inputContainer}>
                      <TextInput
                        label={t("todo.description")}
                        onChangeText={handleChange("description")}
                        onBlur={handleBlur("description")}
                        placeholder={t("todo.descriptionPlaceholder")}
                        value={values.description}
                        mode="outlined"
                        error={!!(errors.description && touched.description)}
                        left={<TextInput.Icon icon="text-box-outline" />}
                        multiline
                        numberOfLines={4}
                        style={[
                          styles.textArea,
                          { backgroundColor: theme.colors.surface },
                        ]}
                        textColor={theme.colors.onSurface}
                      />
                      <HelperText
                        type="error"
                        visible={!!(errors.description && touched.description)}
                      >
                        {errors.description}
                      </HelperText>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Campo Tipo de Tarefa */}
                    <View style={styles.inputContainer}>
                      <Text
                        variant="labelLarge"
                        style={{
                          color: theme.colors.onSurfaceVariant,
                          marginBottom: 8,
                          fontWeight: "600",
                        }}
                      >
                        {t("todo.taskType")}
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
                            icon={
                              typeOptions.find(
                                (opt) => opt.value === values.type,
                              )?.icon || "chevron-down"
                            }
                          >
                            {typeOptions.find(
                              (opt) => opt.value === values.type,
                            )?.label || t("todo.selectType")}
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
                            leadingIcon={option.icon}
                          />
                        ))}
                      </Menu>
                      <HelperText
                        type="error"
                        visible={!!(errors.type && touched.type)}
                      >
                        {errors.type}
                      </HelperText>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Datas */}
                    <View style={styles.datesContainer}>
                      {/* Data de Início */}
                      <View style={styles.dateInputContainer}>
                        <Text
                          variant="labelLarge"
                          style={{
                            color: theme.colors.onSurfaceVariant,
                            marginBottom: 8,
                            fontWeight: "600",
                          }}
                        >
                          {t("todo.startDate")}
                        </Text>
                        <Button
                          mode="contained"
                          onPress={() => setShowStartPicker(true)}
                          style={styles.dateButton}
                          contentStyle={styles.dateButtonContent}
                          icon="calendar-start"
                          buttonColor={theme.colors.primaryContainer}
                          textColor={theme.colors.onPrimaryContainer}
                        >
                          {values.start
                            ? new Date(values.start).toLocaleDateString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : t("todo.selectDate")}
                        </Button>
                        {showStartPicker && (
                          <RNDateTimePicker
                            value={
                              values.start ? new Date(values.start) : new Date()
                            }
                            mode="date"
                            display={
                              Platform.OS === "ios" ? "spinner" : "default"
                            }
                            onChange={(event: any, date?: Date) => {
                              setShowStartPicker(false);
                              if (date) {
                                setFieldValue("start", date);
                              }
                            }}
                          />
                        )}
                        <HelperText
                          type="error"
                          visible={!!(errors.start && touched.start)}
                        >
                          {errors.start as string}
                        </HelperText>
                      </View>

                      {/* Data de Término */}
                      <View style={styles.dateInputContainer}>
                        <Text
                          variant="labelLarge"
                          style={{
                            color: theme.colors.onSurfaceVariant,
                            marginBottom: 8,
                            fontWeight: "600",
                          }}
                        >
                          {t("todo.endDate")}
                        </Text>
                        <Button
                          mode="contained"
                          onPress={() => setShowEndPicker(true)}
                          style={styles.dateButton}
                          contentStyle={styles.dateButtonContent}
                          icon="calendar-end"
                          buttonColor={theme.colors.secondaryContainer}
                          textColor={theme.colors.onSecondaryContainer}
                        >
                          {values.end
                            ? new Date(values.end).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : t("todo.selectDate")}
                        </Button>
                        {showEndPicker && (
                          <RNDateTimePicker
                            value={
                              values.end ? new Date(values.end) : new Date()
                            }
                            mode="date"
                            display={
                              Platform.OS === "ios" ? "spinner" : "default"
                            }
                            onChange={(event: any, date?: Date) => {
                              setShowEndPicker(false);
                              if (date) {
                                setFieldValue("end", date);
                              }
                            }}
                          />
                        )}
                        <HelperText
                          type="error"
                          visible={!!(errors.end && touched.end)}
                        >
                          {errors.end as string}
                        </HelperText>
                      </View>
                    </View>

                    {/* Botões de Ação */}
                    <View style={styles.controls}>
                      <Button
                        mode="contained"
                        onPress={() => handleSubmit()}
                        style={styles.mainButton}
                        contentStyle={styles.buttonContent}
                        icon={todo ? "check" : "plus"}
                        loading={isPending}
                        disabled={isPending}
                      >
                        {todo ? t("todo.updateTask") : t("todo.createTask")}
                      </Button>

                      {todo && (
                        <Button
                          mode="contained"
                          onPress={() => handleDelete()}
                          style={styles.deleteButton}
                          contentStyle={styles.buttonContent}
                          buttonColor={theme.colors.errorContainer}
                          textColor={theme.colors.onErrorContainer}
                          icon="delete-alert"
                          loading={isPending}
                          disabled={isPending}
                        >
                          {t("todo.deleteTask")}
                        </Button>
                      )}
                    </View>

                    {error && (
                      <Card
                        style={[
                          styles.messageCard,
                          { backgroundColor: theme.colors.errorContainer },
                        ]}
                      >
                        <Card.Content>
                          <Text
                            style={{ color: theme.colors.onErrorContainer }}
                          >
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
                          <View style={styles.successMessage}>
                            <IconButton
                              icon="check-circle"
                              iconColor={theme.colors.onPrimaryContainer}
                              size={24}
                              style={{ margin: 0 }}
                            />
                            <Text
                              style={{
                                color: theme.colors.onPrimaryContainer,
                                flex: 1,
                              }}
                            >
                              {todo
                                ? t("todo.taskUpdatedSuccess")
                                : t("todo.taskCreatedSuccess")}
                            </Text>
                          </View>
                        </Card.Content>
                      </Card>
                    )}
                  </Card.Content>
                </Card>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Confirmação de Delete */}
      <CustomModal
        title={t("todo.deleteTaskTitle")}
        onDismiss={() => setDeleteModalVisible(false)}
        visible={deleteModalVisible}
        i18nIsDynamicList
        actions={[
          {
            label: t("todo.deleteButton"),
            onPress: handleConfirmDelete,
            icon: "delete-alert",
            mode: "contained",
          },
        ]}
      />
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
    padding: 24,
  },
  formContainer: {
    flex: 1,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    marginBottom: 32,
    marginTop: 8,
  },
  card: {
    borderRadius: 24,
    elevation: 4,
  },
  cardContent: {
    paddingVertical: 32,
    gap: 16,
  },
  inputContainer: {
    gap: 0,
  },
  input: {
    marginBottom: 0,
  },
  textArea: {
    marginBottom: 0,
    minHeight: 100,
  },
  divider: {
    marginVertical: 8,
  },
  selectButton: {
    borderRadius: 12,
  },
  selectButtonContent: {
    height: 56,
    justifyContent: "flex-start",
  },
  datesContainer: {
    gap: 16,
  },
  dateInputContainer: {
    gap: 0,
  },
  dateButton: {
    borderRadius: 12,
  },
  dateButtonContent: {
    paddingVertical: 8,
  },
  controls: {
    gap: 12,
    marginTop: 16,
  },
  mainButton: {
    borderRadius: 12,
  },
  deleteButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 8,
  },
  messageCard: {
    marginTop: 8,
    borderRadius: 12,
  },
  successMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default FormEditOrCreateTodo;
