import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Card,
  Text,
  Button,
  TextInput,
  FAB,
  useTheme,
} from "react-native-paper";
import * as Progress from "react-native-progress";
import { usePreferences } from "../context/ThemeProvider";

export const CronometerScreen = () => {
  const { theme } = usePreferences();

  // Tempo total em segundos desde o início do cronômetro
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Duração alvo em minutos (permitir ajuste)
  const [maxMinutes, setMaxMinutes] = useState<number>(5);

  // Estado do cronômetro
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEditingDuration, setIsEditingDuration] = useState<boolean>(false);

  // FAB group open
  const [fabOpen, setFabOpen] = useState<boolean>(false);

  // Interval ref para manter id do setInterval
  const intervalRef = useRef<number | null>(null);

  // Duplo toque detection
  const lastPressRef = useRef<number | null>(null);

  // Efeitos: iniciar / limpar interval
  useEffect(() => {
    if (isRunning && intervalRef.current === null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - React Native setInterval retorna number
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000) as unknown as number;
    }

    if (!isRunning && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // limpar no unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Valores exibidos: HH:MM:SS
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const showedHours = pad(hours);
  const showedMinutes = pad(minutes);
  const showedSeconds = pad(seconds);

  // Progress (0..1) com proteção para divisão por zero
  const totalTargetSeconds = Math.max(1, maxMinutes * 60);
  const progress = Math.min(1, elapsedSeconds / totalTargetSeconds);
  const progressPercentage = Math.round(progress * 100);

  // Controles
  const startCronometer = () => {
    setIsRunning(true);
  };

  const stopCronometer = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
  };

  const onChangeDuration = (text: string) => {
    // aceitar apenas números
    const n = parseInt(text, 10);
    if (!isNaN(n) && n >= 0) {
      setMaxMinutes(n);
    } else if (text === "") {
      // permitir limpar campo temporariamente
      setMaxMinutes(0);
    }
  };

  const addAMinute = () => setMaxMinutes((m) => m + 1);
  const subtractAMinute = () => setMaxMinutes((m) => Math.max(0, m - 1));

  const handleDoubleTap = () => {
    const now = Date.now();
    const last = lastPressRef.current;
    if (last && now - last < 300) {
      // duplo toque detectado
      setIsEditingDuration(true);
    }
    lastPressRef.current = now;
  };

  const finishEditingDuration = () => {
    setIsEditingDuration(false);
    // garantir que pelo menos 0 minuto
    if (maxMinutes < 0) setMaxMinutes(0);
  };

  // Quando alcança ou ultrapassa a duração, parar automaticamente (opcional)
  useEffect(() => {
    if (elapsedSeconds >= totalTargetSeconds && totalTargetSeconds > 0) {
      setIsRunning(false);
    }
  }, [elapsedSeconds, totalTargetSeconds]);

  const isResetable = elapsedSeconds > 0 || !isRunning;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.container}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            <Text
              variant="bodyMedium"
              style={[styles.subtitle, { color: theme.colors.onSurface }]}
            >
              Cronômetro
            </Text>

            <Text
              variant="headlineLarge"
              style={[styles.timerText, { color: theme.colors.onSurface }]}
            >
              {showedHours}:{showedMinutes}:{showedSeconds}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subtitle, { color: theme.colors.onSurface }]}
            >
              Tempo da parte
            </Text>

            <View style={styles.controlsRow}>
              <Button
                mode="contained"
                icon="play"
                onPress={startCronometer}
                // disabled={isRunning}
                labelStyle={isRunning ? styles.disabledLabel : undefined}
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
              >
                Iniciar
              </Button>
              <Button
                mode="contained"
                icon="pause"
                onPress={stopCronometer}
                labelStyle={!isRunning ? styles.disabledLabel : undefined}
                buttonColor={theme.colors.secondary}
                textColor={theme.colors.onSecondary}
              >
                Pausar
              </Button>
            </View>
            <Button
              mode="text"
              icon="stop"
              onPress={reset}
              style={styles.controlButton}
              disabled={!isResetable}
              textColor={theme.colors.primary}
            >
              Resetar
            </Button>

            <View style={styles.controlsRow}>
              <Pressable onPress={handleDoubleTap}>
                <TextInput
                  label="Duração (min)"
                  value={maxMinutes.toString()}
                  mode="outlined"
                  editable={isEditingDuration}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.background,
                      color: theme.colors.onBackground,
                    },
                  ]}
                  onChangeText={onChangeDuration}
                  onBlur={finishEditingDuration}
                  keyboardType="numeric"
                  right={
                    isEditingDuration ? undefined : (
                      <TextInput.Icon
                        icon="pencil"
                        color={theme.colors.primary}
                      />
                    )
                  }
                />
              </Pressable>
            </View>

            <View style={styles.progressWrapper}>
              <Progress.Circle
                progress={progress}
                color={theme.colors.primary}
                borderColor={theme.colors.outline}
                formatText={() => `${progressPercentage}%`}
                size={92}
                thickness={8}
                showsText
              />
              <Text
                variant="bodySmall"
                style={[
                  styles.progressLabel,
                  { color: theme.colors.onSurface },
                ]}
              >
                {progressPercentage}% — {showedMinutes}:{showedSeconds} /{" "}
                {maxMinutes.toString()}:00 min
              </Text>
            </View>
          </Card.Content>
        </Card>

        <FAB.Group
          open={fabOpen}
          visible
          icon={fabOpen ? "pencil" : "play"}
          onStateChange={({ open }) => setFabOpen(open)}
          style={styles.fabGroup}
          fabStyle={{ backgroundColor: theme.colors.primary }}
          actions={[
            {
              icon: "plus",
              onPress: addAMinute,
              label: "1+ min",
            },
            {
              icon: "minus",
              onPress: subtractAMinute,
              label: "1- min",
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 8 },
  card: { borderRadius: 8, padding: 16 },
  cardContent: { alignItems: "center", paddingVertical: 20 },
  timerText: { marginBottom: 8 },
  subtitle: { textAlign: "center", marginBottom: 12 },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    justifyContent: "center",
    gap: 8,
  },
  outlinedDisabled: {
    // impedir que a opacidade padrão esconda o botão completamente
    opacity: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)", // cor de borda suave para aparência 'desativada'
    backgroundColor: "transparent",
  },
  /* Estilo de label quando disabled */
  disabledLabel: {
    color: "rgba(0,0,0,0.38)", // cor de texto de disabled do Material (visível)
  },
  controlButton: { marginLeft: 8 },
  input: { width: 140, marginTop: 12 },
  progressWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  progress: { height: 8, width: "100%", borderRadius: 8 },
  progressLabel: { marginTop: 8 },
  fabGroup: { position: "absolute", right: 16, bottom: 24 },
});

export default CronometerScreen;
