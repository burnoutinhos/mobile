import { Formik } from "formik";
import {
  emptyTodoForm,
  TodoSchema,
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
  Banner,
  Button,
  Card,
  Divider,
  HelperText,
  IconButton,
  Menu,
  Text,
  TextInput,
} from "react-native-paper";
import DatePicker from "@dietime/react-native-date-picker";
import { CustomModal } from "../../../components/Modal";
import { useFormEditOrCreateTodo } from "../controllers/FormEditOrCreateTodoController";

const FormEditOrCreateTodo = ({ todo }: { todo?: ITodo }) => {
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
              <View style={styles.formContainer}>
                <Text
                  variant="headlineMedium"
                  style={[styles.title, { color: theme.colors.primary }]}
                >
                  {todo ? "Editar Tarefa" : "Nova Tarefa"}
                </Text>

                <Text
                  variant="bodyLarge"
                  style={[
                    styles.subtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {todo
                    ? "Atualize as informações da sua tarefa"
                    : "Preencha os dados para criar uma nova tarefa"}
                </Text>

                <Card
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  elevation={2}
                >
                  <Card.Title
                    title="Informações da Tarefa"
                    titleVariant="titleLarge"
                    titleStyle={{
                      color: theme.colors.onSurface,
                      fontWeight: "700",
                    }}
                    left={(props) => (
                      <IconButton
                        {...props}
                        icon={todo ? "pencil" : "plus-circle"}
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
                        style={[
                          styles.label,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Nome
                      </Text>
                      <TextInput
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        placeholder="Digite o nome da tarefa"
                        value={values.name}
                        mode="outlined"
                        error={!!(errors.name && touched.name)}
                        left={<TextInput.Icon icon="format-text" />}
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
                      <Text
                        variant="labelLarge"
                        style={[
                          styles.label,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Descrição
                      </Text>
                      <TextInput
                        onChangeText={handleChange("description")}
                        onBlur={handleBlur("description")}
                        placeholder="Digite a descrição"
                        value={values.description}
                        mode="outlined"
                        error={!!(errors.description && touched.description)}
                        left={<TextInput.Icon icon="text" />}
                        contentStyle={{
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: 10,
                        }}
                        style={{
                          paddingVertical: 10,
                          justifyContent: "center",
                        }}
                        multiline
                        numberOfLines={3}
                      />
                      <HelperText
                        type="error"
                        visible={!!(errors.description && touched.description)}
                      >
                        {errors.description}
                      </HelperText>
                    </View>

                    {/* Campo Tipo de Tarefa */}
                    <View style={styles.inputContainer}>
                      <Text
                        variant="labelLarge"
                        style={[
                          styles.label,
                          { color: theme.colors.onSurface },
                        ]}
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
                            icon={
                              typeOptions.find(
                                (opt) => opt.value === values.type,
                              )?.icon || "chevron-down"
                            }
                          >
                            {typeOptions.find(
                              (opt) => opt.value === values.type,
                            )?.label || "Selecione o tipo"}
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

                    {/* Data de Início */}
                    <View style={styles.inputContainer}>
                      <Text
                        variant="labelLarge"
                        style={[
                          styles.label,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Data de Início
                      </Text>
                      <Button
                        mode="outlined"
                        onPress={() => setShowStartPicker(true)}
                        style={styles.dateButton}
                        contentStyle={styles.dateButtonContent}
                        icon="calendar"
                      >
                        {values.start
                          ? new Date(values.start).toLocaleDateString("pt-BR")
                          : "Selecione a data"}
                      </Button>
                      {showStartPicker && (
                        <DatePicker
                          value={
                            values.start ? new Date(values.start) : new Date()
                          }
                          onChange={(date) => {
                            setFieldValue("start", date);
                            setShowStartPicker(false);
                          }}
                        />
                      )}
                    </View>

                    {/* Data de Término */}
                    <View style={styles.inputContainer}>
                      <Text
                        variant="labelLarge"
                        style={[
                          styles.label,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Data de Término
                      </Text>
                      <Button
                        mode="outlined"
                        onPress={() => setShowEndPicker(true)}
                        style={styles.dateButton}
                        contentStyle={styles.dateButtonContent}
                        icon="calendar"
                      >
                        {values.end
                          ? new Date(values.end).toLocaleDateString("pt-BR")
                          : "Selecione a data"}
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
                  </Card.Content>
                </Card>

                {/* Botão de Ação */}
                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  icon={todo ? "check" : "plus"}
                  loading={isPending}
                  disabled={isPending}
                >
                  {todo ? "Atualizar Tarefa" : "Criar Tarefa"}
                </Button>

                {/* Loading */}
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
                      {todo ? "Atualizando tarefa..." : "Criando tarefa..."}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </Formik>
          {todo ? (
            <>
              <Button
                mode="contained"
                onPress={() => handleDelete()}
                style={styles.button}
                buttonColor={theme.colors.error}
                textColor={theme.colors.onError}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon={"delete-alert"}
                loading={isPending}
                disabled={isPending}
              >
                Deletar tarefa
              </Button>
              <CustomModal
                title="Deletar Tarefa"
                onDismiss={() => setDeleteModalVisible(false)}
                visible={deleteModalVisible}
                actions={[
                  {
                    label: "Apagar",
                    onPress: handleConfirmDelete,
                    icon: "delete-alert",
                  },
                ]}
              />
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Mensagem de Sucesso */}
      {data && (
        <Banner
          visible={!!data}
          actions={[
            {
              label: "OK",
              onPress: () => {
                resetUpdate();
                resetCreate();
              },
            },
          ]}
          icon="check-circle"
          style={{
            backgroundColor: theme.colors.primaryContainer,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Text style={{ color: theme.colors.onPrimaryContainer }}>
            {todo
              ? "Tarefa atualizada com sucesso!"
              : "Tarefa criada com sucesso!"}
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
              onPress: () => {
                resetUpdate();
                resetCreate();
              },
            },
          ]}
          icon="alert-circle"
          style={{
            backgroundColor: theme.colors.errorContainer,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Text style={{ color: theme.colors.onErrorContainer }}>
            {error.message}
          </Text>
        </Banner>
      )}
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
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
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
  selectButton: {
    justifyContent: "flex-start",
  },
  selectButtonContent: {
    height: 56,
    justifyContent: "flex-start",
  },
  dateButton: {
    alignSelf: "stretch",
  },
  dateButtonContent: {
    height: 56,
    justifyContent: "flex-start",
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 16,
  },
});

export default FormEditOrCreateTodo;
