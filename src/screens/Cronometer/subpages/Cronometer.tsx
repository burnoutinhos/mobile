import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  FAB,
  ProgressBar,
  Text,
  TextInput,
  HelperText,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreferences } from "../../../context/ThemeProvider";
import { MaxMinutesModal } from "../components/MaxMinutesModal";
import { CustomModal } from "../../../components/Modal";
import { useCronometer } from "../controllers/CronometerController";

export const CronometerScreen = () => {
  const { theme } = usePreferences();

  const {
    // States
    isRunning,
    recordName,
    setRecordName,
    elapsedSeconds,
    maxMinutes,
    setMaxMinutes,
    visible,
    setVisible,
    deleteModalVisible,
    setDeleteModalVisible,
    fabOpen,
    setFabOpen,
    showSaveSuccess,
    timeblock,

    // Computed
    showedHours,
    showedMinutes,
    showedSeconds,
    progress,
    isPending,
    error,

    // Actions
    startCronometer,
    stopCronometer,
    reset,
    handleManualSave,
    handleDelete,
    mutateDelete,
    actions,
  } = useCronometer(theme);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text
            variant="headlineMedium"
            style={{
              color: theme.colors.primary,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {timeblock ? "Continuar Registro" : "Cronômetro"}
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            {timeblock
              ? "Continue de onde você parou"
              : "Gerencie seu tempo com foco"}
          </Text>
        </View>

        <Card
          style={[
            styles.timerCard,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Card.Content style={styles.timerCardContent}>
            <View style={styles.nameInputContainer}>
              <TextInput
                label="Nome do registro"
                value={recordName}
                onChangeText={setRecordName}
                mode="outlined"
                placeholder="Ex: Estudo de React"
                style={[
                  styles.nameInput,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurfaceVariant}
                left={<TextInput.Icon icon="tag-outline" />}
                disabled={isRunning}
              />
              <HelperText
                type="info"
                style={{ color: theme.colors.onSurfaceVariant }}
                visible={!recordName && !isRunning}
              >
                Dê um nome para identificar este registro
              </HelperText>
            </View>

            <View style={styles.timerDisplay}>
              <Text
                variant="displayLarge"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  fontWeight: "bold",
                  fontVariant: ["tabular-nums"],
                }}
              >
                {showedHours}:{showedMinutes}:{showedSeconds}
              </Text>
              <Text
                variant="labelLarge"
                style={{ color: theme.colors.outline }}
              >
                Tempo decorrido
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <ProgressBar
                progress={progress}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
              <View style={styles.progressLabels}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Meta: {maxMinutes} min
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {Math.round(progress * 100)}%
                </Text>
              </View>
              <Button
                mode="contained"
                icon="watch-import"
                onPress={() => setVisible(true)}
              >
                {maxMinutes !== 0 ? "Mudar" : "Definir"} meta
              </Button>
            </View>

            <View style={styles.controls}>
              {!isRunning ? (
                <Button
                  mode="contained"
                  onPress={() => {
                    if (maxMinutes === 0) {
                      setVisible(true);
                      return;
                    }
                    startCronometer();
                  }}
                  icon="play"
                  style={styles.mainButton}
                  contentStyle={styles.buttonContent}
                >
                  Iniciar
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={stopCronometer}
                  icon="pause"
                  buttonColor={theme.colors.secondary}
                  textColor={theme.colors.onSecondary}
                  style={styles.mainButton}
                  contentStyle={styles.buttonContent}
                >
                  Pausar
                </Button>
              )}

              <Button
                mode="outlined"
                onPress={reset}
                icon="refresh"
                disabled={elapsedSeconds === 0}
                style={styles.resetButton}
              >
                Reiniciar
              </Button>

              <Button
                mode={showSaveSuccess ? "contained" : "outlined"}
                onPress={handleManualSave}
                icon={showSaveSuccess ? "check" : "content-save"}
                disabled={isPending || maxMinutes === 0}
                style={[
                  styles.saveButton,
                  showSaveSuccess && {
                    backgroundColor: theme.colors.success,
                  },
                ]}
                textColor={
                  showSaveSuccess
                    ? theme.colors.onSuccess
                    : theme.colors.primary
                }
                loading={isPending}
              >
                {showSaveSuccess ? "Salvo!" : "Salvar"}
              </Button>

              <Button
                mode="contained"
                onPress={handleDelete}
                icon="delete-alert"
                disabled={isPending || maxMinutes === 0}
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: theme.colors.errorContainer,
                  },
                ]}
                textColor={theme.colors.onErrorContainer}
                loading={isPending}
              >
                Deletar registro
              </Button>
            </View>

            {isPending && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Salvando progresso...
                </Text>
              </View>
            )}

            {error && (
              <Card
                style={[
                  styles.messageCard,
                  { backgroundColor: theme.colors.errorContainer },
                ]}
              >
                <Card.Content>
                  <Text style={{ color: theme.colors.onErrorContainer }}>
                    {error.response?.data?.message ||
                      error.message ||
                      "Erro ao salvar o timeblock"}
                  </Text>
                </Card.Content>
              </Card>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB.Group
        open={fabOpen}
        visible
        icon={fabOpen ? "close" : "clock-edit-outline"}
        actions={actions}
        onStateChange={({ open }) => setFabOpen(open)}
        fabStyle={{ backgroundColor: theme.colors.primary }}
        color={theme.colors.onPrimary}
      />

      <MaxMinutesModal
        setMaxMinutes={setMaxMinutes}
        setVisible={setVisible}
        visible={visible}
      />

      <CustomModal
        title="Confirmar exclusão?"
        onDismiss={() => setDeleteModalVisible(false)}
        visible={deleteModalVisible}
        actions={[
          {
            label: "Deletar",
            icon: "delete",
            onPress: mutateDelete,
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
  content: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
    marginTop: 8,
  },
  timerCard: {
    borderRadius: 24,
    elevation: 4,
  },
  timerCardContent: {
    paddingVertical: 32,
    gap: 24,
  },
  nameInputContainer: {
    gap: 0,
  },
  nameInput: {
    marginBottom: 0,
    borderRadius: 24,
  },
  timerDisplay: {
    alignItems: "center",
    gap: 8,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controls: {
    gap: 16,
    marginTop: 8,
  },
  mainButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resetButton: {
    borderRadius: 12,
    borderColor: "transparent",
  },
  saveButton: {
    borderRadius: 12,
    borderColor: "transparent",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  messageCard: {
    marginTop: 8,
  },
});

export default CronometerScreen;
