import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const NotificationsScreen = () => {
  const { theme } = usePreferences();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Nova mensagem",
      message: "Você recebeu uma nova mensagem de João Silva",
      time: "Agora",
      read: false,
    },
    {
      id: "2",
      title: "Backup concluído",
      message: "Seu backup foi concluído com sucesso",
      time: "1h atrás",
      read: true,
    },
    {
      id: "3",
      title: "Atualização disponível",
      message: "Uma nova versão do aplicativo está disponível",
      time: "2h atrás",
      read: false,
    },
    {
      id: "4",
      title: "Lembrete",
      message: "Você tem uma reunião às 15:00",
      time: "3h atrás",
      read: true,
    },
  ]);

  function toggleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  }

  function deleteNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <Button
            mode="text"
            compact
            onPress={markAllAsRead}
            disabled={notifications.length === 0}
          >
            Marcar todas lidas
          </Button>
          <Button
            mode="text"
            compact
            onPress={clearAll}
            disabled={notifications.length === 0}
          >
            Limpar tudo
          </Button>
        </View>
      </View>

      {notifications.length === 0 ? (
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
          // refreshControl={}
          contentContainerStyle={styles.scrollContent}
        >
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.inverseOnSurface,
                  opacity: notification.read ? 0.6 : 1,
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
                        fontWeight: notification.read ? "normal" : "600",
                        flex: 1,
                        color: theme.colors.onBackground,
                      }}
                    >
                      {notification.title}
                    </Text>
                    {!notification.read && (
                      <Badge
                        size={8}
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    )}
                  </View>
                }
                subtitle={notification.time}
                subtitleStyle={{
                  marginTop: 4,
                  color: theme.colors.onBackground,
                }}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete-outline"
                    size={20}
                    onPress={() => deleteNotification(notification.id)}
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
              <Card.Actions>
                <Button
                  mode="text"
                  compact
                  onPress={() => toggleRead(notification.id)}
                >
                  {notification.read ? "Marcar não lida" : "Marcar lida"}
                </Button>
              </Card.Actions>
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
