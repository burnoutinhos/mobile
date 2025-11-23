import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button, IconButton, Badge } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import { CustomModal } from "../../components/Modal";
import { useNotifications } from "./controllers/NotificationsController";
import { useTranslation } from "react-i18next";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const NotificationsScreen = () => {
  const { t } = useTranslation();
  const {
    theme,
    deleteModalVisible,
    setDeleteModalVisible,
    clearAllModalVisible,
    setClearAllModalVisible,
    notifications,
    isLoading,
    isFetching,
    isFetched,
    refetch,
    isPendingDelete,
    isPendingClearAll,
    handleDeleteNotification,
    handleConfirmDelete,
    handleClearAll,
    handleConfirmClearAll,
  } = useNotifications();

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
            onPress={handleClearAll}
            disabled={!notifications || notifications.length === 0}
          >
            {t("notifications.clearAll")}
          </Button>
        </View>
      </View>

      {!notifications || notifications.length === 0 ? (
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
            {t("notifications.noNotifications")}
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
          {notifications?.map((notification) => (
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
                    onPress={() => handleDeleteNotification(notification.id)}
                    disabled={isPendingDelete}
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

      <CustomModal
        title={t("notifications.deleteTitle")}
        onDismiss={() => setDeleteModalVisible(false)}
        visible={deleteModalVisible}
        i18nIsDynamicList
        actions={[
          {
            label: t("notifications.deleteButton"),
            icon: "delete",
            onPress: handleConfirmDelete,
          },
          {
            label: t("notifications.cancel"),
            onPress: () => setDeleteModalVisible(false),
          },
        ]}
      />

      <CustomModal
        title={t("notifications.clearAllTitle")}
        onDismiss={() => setClearAllModalVisible(false)}
        visible={clearAllModalVisible}
        i18nIsDynamicList
        actions={[
          {
            label: t("notifications.clearAllButton"),
            icon: "delete-sweep",
            onPress: handleConfirmClearAll,
          },
          {
            label: t("notifications.cancel"),
            onPress: () => setClearAllModalVisible(false),
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
