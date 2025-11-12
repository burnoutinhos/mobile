import React, { createElement, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  Card,
  Text,
  Button,
  IconButton,
  useTheme,
  Badge,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreferences } from "../context/ThemeProvider";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../services/api/query-keys";
import api from "../services/api";
import { endpoints } from "../services/api/endpoints";
import { NotificationResponse } from "../model/notification/notification";
import { queryClient } from "../../App";
import { ActivityIndicator } from "react-native-paper";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const NotificationsScreen = () => {
  const { theme } = usePreferences();
  const [notificationSelectedId, setNotificationSelectedId] = useState(0);

  const {
    data: notifications,
    isLoading,
    refetch,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: [queryKeys.notification.findAll],
    queryFn: async () => {
      const res = await api.get<NotificationResponse[]>(
        endpoints.notification.findAll,
      );
      return res.data.map((not) => ({
        ...not,
        created_at:
          not.created_at instanceof Date
            ? not.created_at
            : new Date((not.created_at as unknown as string) || Date.now()),
      }));
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const { mutate: removeNotification } = useMutation({
    mutationKey: [`${queryKeys.notification.findAll}`],
    mutationFn: async (id: number) => {
      await api.delete(`${endpoints.notification.findAll}/${id}`);
      return id;
    },
    onSuccess: (id: number) => {
      const queryClient = useQueryClient();
      const previous = queryClient.getQueryData([
        queryKeys.notification.findAll,
      ]) as NotificationResponse[];

      queryClient.setQueryData(
        [queryKeys.notification.findAll],
        previous?.filter((not) => not.id !== id),
      );
    },
  });

  const { mutate: clearAll } = useMutation({
    mutationKey: [queryKeys.notification.single],
    mutationFn: async () => await api.delete(endpoints.notification.findAll),
    onSuccess: () => {
      const queryClient = useQueryClient();
      queryClient.removeQueries({
        queryKey: [queryKeys.notification.findAll],
      });
    },
  });

  if (isLoading || isFetching || !isFetched)
    return <ActivityIndicator size="large" />;
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <Button
            mode="text"
            compact
            onPress={() => clearAll()}
            disabled={notifications && notifications.length === 0}
          >
            Limpar tudo
          </Button>
        </View>
      </View>

      {notifications && notifications.length === 0 ? (
        <View style={styles.empty}>
          <IconButton
            icon="bell-off-outline"
            size={64}
            iconColor={theme.colors.outline}
          />
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceDisabled, marginTop: 8 }}
          >
            Nenhuma notificação
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[theme.colors.primary]}
              progressBackgroundColor={theme.colors.background}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {notifications &&
            notifications.map((notification) => (
              <Card
                key={notification.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.inverseOnSurface,
                  },
                ]}
                mode="elevated"
              >
                <Card.Title
                  title={
                    <View style={styles.titleRow}>
                      <Text
                        variant="titleMedium"
                        style={{
                          flex: 1,
                          color: theme.colors.onBackground,
                        }}
                      >
                        {notification.message}
                      </Text>
                      {notification.created_at.getDay() ===
                        new Date().getDay() && (
                        <Badge
                          size={8}
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                      )}
                    </View>
                  }
                  subtitle={notification.created_at.toDateString()}
                  subtitleStyle={{
                    marginTop: 4,
                    color: theme.colors.onBackground,
                  }}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="delete-outline"
                      size={20}
                      onPress={() => removeNotification(notification.id)}
                    />
                  )}
                />
                <Card.Content style={styles.cardContent}>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {notification.message}
                  </Text>
                </Card.Content>
              </Card>
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardContent: {
    paddingTop: 0,
  },
});

export default NotificationsScreen;
