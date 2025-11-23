import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ITimeBlock, TimeBlockDto } from "../../../model/timeblocks/Timeblock";
import { ErrorResponseDTO } from "../../../model/types";
import { AppParamList } from "../../../navigators/AppNavigator";
import api from "../../../services/api";
import { endpoints } from "../../../services/api/endpoints";
import { queryKeys } from "../../../services/api/query-keys";

export const useCronometer = (theme: any) => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<AppParamList, "Cronometer">>();
  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const queryClient = useQueryClient();
  const timeblock = route.params?.timeblock;

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    timeblock?.timeCount || 0,
  );
  const [maxMinutes, setMaxMinutes] = useState<number>(timeblock?.max || 0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [fabOpen, setFabOpen] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [timeBlockId, setTimeBlockId] = useState<number | null>(
    timeblock?.id || null,
  );
  const saveIntervalRef = useRef<number | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
  const saveSuccessTimeoutRef = useRef<number | null>(null);
  const [recordName, setRecordName] = useState<string>(timeblock?.name || "");

  // Mutation para criar timeblock (POST)
  const createMutation = useMutation<
    AxiosResponse<ITimeBlock>,
    AxiosError<ErrorResponseDTO>,
    TimeBlockDto
  >({
    mutationFn: async (data: TimeBlockDto) => {
      return await api.post(endpoints.timeblock.create, data);
    },
    onSuccess: (response) => {
      setTimeBlockId(response.data.id);
      setShowSaveSuccess(true);

      if (saveSuccessTimeoutRef.current !== null) {
        clearTimeout(saveSuccessTimeoutRef.current);
      }

      saveSuccessTimeoutRef.current = setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000) as unknown as number;
    },
  });

  // Mutation para atualizar timeblock (PUT)
  const updateMutation = useMutation<
    AxiosResponse<ITimeBlock>,
    AxiosError<ErrorResponseDTO>,
    { id: number; data: TimeBlockDto }
  >({
    mutationFn: async ({ id, data }) => {
      return await api.put(endpoints.timeblock.update(id), data);
    },
    onSuccess: () => {
      setShowSaveSuccess(true);

      if (saveSuccessTimeoutRef.current !== null) {
        clearTimeout(saveSuccessTimeoutRef.current);
      }

      saveSuccessTimeoutRef.current = setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000) as unknown as number;
    },
  });

  const deleteMutation = useMutation<
    AxiosResponse<void>,
    AxiosError,
    { id: number }
  >({
    mutationFn: async ({ id }) => {
      return await api.delete(endpoints.timeblock.delete(id));
    },
    onSuccess: () => {
      // Fecha o modal de deleção
      setDeleteModalVisible(false);

      // Invalida a query de timeblocks para atualizar a lista
      queryClient.invalidateQueries({
        queryKey: [queryKeys.timeblock.findAll],
      });

      // Navega de volta para a tela de Timeblocks
      navigation.goBack();
    },
  });

  // Salvar timeblock a cada minuto
  useEffect(() => {
    if (isRunning && saveIntervalRef.current === null) {
      saveIntervalRef.current = setInterval(() => {
        const timeBlockData: TimeBlockDto = {
          name: recordName,
          timeCount: elapsedSeconds,
          type: "CRONOMETER",
          max: maxMinutes,
          start: 0,
          todoId: 0,
        };

        if (timeBlockId === null) {
          createMutation.mutate(timeBlockData);
        } else {
          updateMutation.mutate({ id: timeBlockId, data: timeBlockData });
        }
      }, 2000) as unknown as number; // 60000ms = 1 minuto
    }

    if (!isRunning && saveIntervalRef.current !== null) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }

    return () => {
      if (saveIntervalRef.current !== null) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
      if (saveSuccessTimeoutRef.current !== null) {
        clearTimeout(saveSuccessTimeoutRef.current);
        saveSuccessTimeoutRef.current = null;
      }
    };
  }, [isRunning, timeBlockId, elapsedSeconds, maxMinutes, recordName]);

  // Intervalo do cronômetro
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

  // Computed values
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const showedHours = pad(hours);
  const showedMinutes = pad(minutes);
  const showedSeconds = pad(seconds);

  const totalTargetSeconds = Math.max(1, maxMinutes * 60);
  const progress = Math.min(1, elapsedSeconds / totalTargetSeconds);

  // Actions
  const startCronometer = () => setIsRunning(true);
  const stopCronometer = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setTimeBlockId(null);
    setShowSaveSuccess(false);
    setRecordName("");
    if (saveSuccessTimeoutRef.current !== null) {
      clearTimeout(saveSuccessTimeoutRef.current);
      saveSuccessTimeoutRef.current = null;
    }
  };

  const addAMinute = useCallback(() => setElapsedSeconds((m) => m + 60), []);

  const subtractAMinute = useCallback(
    () => setElapsedSeconds((m) => Math.max(0, m - 60)),
    [],
  );

  const handleManualSave = () => {
    const timeBlockData: TimeBlockDto = {
      name: recordName,
      timeCount: elapsedSeconds,
      type: "CRONOMETER",
      max: maxMinutes,
      start: 0,
      todoId: 0,
    };

    if (timeBlockId === null) {
      createMutation.mutate(timeBlockData);
    } else {
      updateMutation.mutate({ id: timeBlockId, data: timeBlockData });
    }
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const mutateDelete = () => {
    if (timeBlockId !== null) {
      deleteMutation.mutate({ id: timeBlockId });
    }
  };

  const actions = useMemo(
    () => [
      {
        icon: "plus",
        label: t("cronometer.addOneMinute"),
        onPress: addAMinute,
        style: { backgroundColor: theme.colors.primaryContainer },
        color: theme.colors.onPrimaryContainer,
      },
      {
        icon: "minus",
        label: t("cronometer.removeOneMinute"),
        onPress: subtractAMinute,
        style: { backgroundColor: theme.colors.errorContainer },
        color: theme.colors.onErrorContainer,
      },
    ],
    [theme, addAMinute, subtractAMinute, t],
  );

  return {
    // States
    elapsedSeconds,
    setElapsedSeconds,
    maxMinutes,
    setMaxMinutes,
    isRunning,
    fabOpen,
    setFabOpen,
    visible,
    setVisible,
    deleteModalVisible,
    setDeleteModalVisible,
    showSaveSuccess,
    recordName,
    setRecordName,
    timeblock,

    // Computed
    showedHours,
    showedMinutes,
    showedSeconds,
    progress,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: (createMutation.error ||
      updateMutation.error ||
      deleteMutation.error) as AxiosError<ErrorResponseDTO> | null,

    // Actions
    startCronometer,
    stopCronometer,
    reset,
    handleManualSave,
    handleDelete,
    mutateDelete,
    actions,
  };
};
