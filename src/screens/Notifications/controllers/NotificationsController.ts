import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePreferences } from "../../../context/ThemeProvider";
import { queryKeys } from "../../../services/api/query-keys";
import api from "../../../services/api";
import { endpoints } from "../../../services/api/endpoints";
import { NotificationResponse } from "../../../model/notification/notification";
import { PageableResponse } from "../../../model/types";

export const useNotifications = () => {
  const { theme } = usePreferences();
  const queryClient = useQueryClient();

  const [notificationSelectedId, setNotificationSelectedId] = useState<
    number | null
  >(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clearAllModalVisible, setClearAllModalVisible] = useState(false);

  const {
    data: notificationsResponse,
    isLoading,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: [queryKeys.notification.findAll],
    queryFn: async () => {
      const res = await api.get<PageableResponse<NotificationResponse>>(
        endpoints.notification.findMe,
      );
      return {
        ...res.data,
        content: res.data.content.map((not) => ({
          ...not,
          created_at:
            not.created_at instanceof Date
              ? not.created_at
              : new Date((not.created_at as unknown as string) || Date.now()),
        })),
      };
    },
  });

  const notifications = notificationsResponse?.content;

  useEffect(() => {
    refetch();
  }, []);

  const { mutate: removeNotification, isPending: isPendingDelete } =
    useMutation({
      mutationKey: [queryKeys.notification.delete],
      mutationFn: async (id: number) => {
        await api.delete(endpoints.notification.delete(id));
        return id;
      },
      onSuccess: (id: number) => {
        // Fecha o modal de deleção
        setDeleteModalVisible(false);
        setNotificationSelectedId(null);

        // Atualiza a cache local
        const previous = queryClient.getQueryData([
          queryKeys.notification.findAll,
        ]) as PageableResponse<NotificationResponse>;

        if (previous) {
          queryClient.setQueryData([queryKeys.notification.findAll], {
            ...previous,
            content: previous.content.filter((not) => not.id !== id),
            totalElements: previous.totalElements - 1,
            numberOfElements: (previous.numberOfElements || 0) - 1,
          });
        }
      },
    });

  const { mutate: clearAll, isPending: isPendingClearAll } = useMutation({
    mutationKey: [queryKeys.notification.single],
    mutationFn: async () => await api.delete(endpoints.notification.findAll),
    onSuccess: () => {
      // Fecha o modal de limpar tudo
      setClearAllModalVisible(false);

      // Remove todas as notificações da cache
      queryClient.removeQueries({
        queryKey: [queryKeys.notification.findAll],
      });
    },
  });

  const handleDeleteNotification = (id: number) => {
    setNotificationSelectedId(id);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (notificationSelectedId !== null) {
      removeNotification(notificationSelectedId);
    }
  };

  const handleClearAll = () => {
    setClearAllModalVisible(true);
  };

  const handleConfirmClearAll = () => {
    clearAll();
  };

  return {
    // States
    theme,
    notificationSelectedId,
    deleteModalVisible,
    setDeleteModalVisible,
    clearAllModalVisible,
    setClearAllModalVisible,

    // Query
    notifications,
    isLoading,
    isFetching,
    isFetched,
    refetch,

    // Mutations
    isPendingDelete,
    isPendingClearAll,

    // Actions
    handleDeleteNotification,
    handleConfirmDelete,
    handleClearAll,
    handleConfirmClearAll,
  };
};
