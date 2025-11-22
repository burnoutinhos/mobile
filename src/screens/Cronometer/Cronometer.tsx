import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, FAB, ProgressBar, Card } from "react-native-paper";
import { usePreferences } from "../../context/ThemeProvider";
import { CustomModal } from "../../components/Modal";
import { Formik } from "formik";
import { MaxMinutesModal } from "./components/MaxMinutesModal";

export const CronometerScreen = () => {
  const { theme } = usePreferences();

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [maxMinutes, setMaxMinutes] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [fabOpen, setFabOpen] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isRunning && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000) as unknown as number;
    }

    if (!isRunning && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const showedHours = pad(hours);
  const showedMinutes = pad(minutes);
  const showedSeconds = pad(seconds);

  const totalTargetSeconds = Math.max(1, maxMinutes * 60);
  const progress = Math.min(1, elapsedSeconds / totalTargetSeconds);

  const startCronometer = () => setIsRunning(true);
  const stopCronometer = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
  };

  const addAMinute = useCallback(() => setElapsedSeconds((m) => m + 60), []);
  const subtractAMinute = useCallback(
    () => setElapsedSeconds((m) => Math.max(0, m - 60)),
    []
  );

  const actions = useMemo(
    () => [
      {
        icon: "plus",
        label: "Adicionar 1 min",
        onPress: addAMinute,
        style: { backgroundColor: theme.colors.primaryContainer },
        color: theme.colors.onPrimaryContainer,
      },
      {
        icon: "minus",
        label: "Remover 1 min",
        onPress: subtractAMinute,
        style: { backgroundColor: theme.colors.errorContainer },
        color: theme.colors.onErrorContainer,
      },
    ],
    [theme, addAMinute, subtractAMinute]
  );

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
            Cronômetro
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            Gerencie seu tempo com foco
          </Text>
        </View>

        <Card
          style={[
            styles.timerCard,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Card.Content style={styles.timerCardContent}>
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
                Mudar meta
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
            </View>
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
    gap: 32,
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
});

export default CronometerScreen;
