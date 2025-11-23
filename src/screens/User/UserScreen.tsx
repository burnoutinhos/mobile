import { SafeAreaView } from "react-native-safe-area-context";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import {
  ActivityIndicator,
  Text,
  Card,
  Avatar,
  Divider,
  IconButton,
  Switch,
  Button,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { CustomModal } from "../../components/Modal";
import FormEditUser from "./subpages/FormEditUser";
import { useUser } from "./controllers/UserController";

const UserScreen = () => {
  const { t } = useTranslation();
  const {
    visible,
    setVisible,
    currentLanguage,
    theme,
    toggleTheme,
    user,
    isLoading,
    error,
    isRefetching,
    refetch,
    languages,
    logout,
    handleLogout,
    changeLanguage,
    getInitial,
  } = useUser();

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          variant="bodyLarge"
          style={[styles.loadingText, { color: theme.colors.onBackground }]}
        >
          {t("user.loadingProfile")}
        </Text>
      </SafeAreaView>
    );
  }

  if (!user || error) {
    return (
      <SafeAreaView
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Avatar.Icon
          size={80}
          icon="account-alert"
          style={{ backgroundColor: theme.colors.errorContainer }}
        />
        <Text
          variant="headlineSmall"
          style={[styles.errorTitle, { color: theme.colors.error }]}
        >
          {t("user.userNotFound")}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onBackground, textAlign: "center" }}
        >
          {t("user.couldNotLoadProfile")}
        </Text>
      </SafeAreaView>
    );
  }

  const initial = getInitial();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card with Avatar and Info */}
        <Card
          style={[
            styles.headerCard,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          elevation={3}
        >
          <Card.Content style={styles.headerContent}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              {user.data.profileImage !== null ? (
                <Avatar.Image
                  source={{ uri: user.data.profileImage }}
                  size={100}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Text
                  size={100}
                  label={initial}
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  labelStyle={{
                    color: theme.colors.onPrimary,
                    fontWeight: "700",
                    fontSize: 40,
                  }}
                />
              )}
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Text
                variant="headlineMedium"
                style={[
                  styles.userName,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {user.data.name}
              </Text>
              <Text
                variant="bodyLarge"
                style={[
                  styles.userEmail,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {user.data.email}
              </Text>
            </View>

            {/* Logout Button */}
            <Button
              mode="contained-tonal"
              onPress={handleLogout}
              icon="logout"
              style={styles.logoutButton}
              buttonColor={theme.colors.errorContainer}
              textColor={theme.colors.onErrorContainer}
            >
              {t("user.logout")}
            </Button>
          </Card.Content>
        </Card>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <FormEditUser user={user.data} />
        </View>

        {/* Settings Section */}
        <Card
          style={[
            styles.settingsCard,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={1}
        >
          <Card.Content style={styles.settingsContent}>
            <View style={styles.settingHeader}>
              <IconButton
                icon="cog"
                size={24}
                iconColor={theme.colors.primary}
              />
              <Text
                variant="titleLarge"
                style={[
                  styles.settingsTitle,
                  { color: theme.colors.onSurface },
                ]}
              >
                {t("user.settings")}
              </Text>
            </View>

            <Divider style={styles.sectionDivider} />

            {/* Language Selector */}
            <View style={styles.settingSection}>
              <Text
                variant="titleMedium"
                style={[styles.settingLabel, { color: theme.colors.onSurface }]}
              >
                {t("user.language")}
              </Text>
              <View style={styles.languageContainer}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => changeLanguage(lang.code)}
                    style={[
                      styles.languageButton,
                      {
                        backgroundColor:
                          currentLanguage === lang.code
                            ? theme.colors.primaryContainer
                            : theme.colors.surfaceVariant,
                        borderColor:
                          currentLanguage === lang.code
                            ? theme.colors.primary
                            : "transparent",
                      },
                    ]}
                  >
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text
                      style={[
                        styles.languageName,
                        {
                          color:
                            currentLanguage === lang.code
                              ? theme.colors.onPrimaryContainer
                              : theme.colors.onSurfaceVariant,
                          fontWeight:
                            currentLanguage === lang.code ? "700" : "400",
                        },
                      ]}
                    >
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Divider style={styles.sectionDivider} />

            {/* Theme Toggle */}
            <View style={styles.settingSection}>
              <View style={styles.themeRow}>
                <View style={styles.themeInfo}>
                  <IconButton
                    icon={theme.dark ? "weather-night" : "weather-sunny"}
                    size={24}
                    iconColor={theme.colors.primary}
                  />
                  <View>
                    <Text
                      variant="titleMedium"
                      style={[
                        styles.themeLabel,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {t("user.darkTheme")}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      {theme.dark ? t("user.enabled") : t("user.disabled")}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={theme.dark}
                  onValueChange={toggleTheme}
                  trackColor={{
                    false: theme.colors.surfaceVariant,
                    true: theme.colors.primary,
                  }}
                  thumbColor={theme.colors.surface}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Logout Modal */}
        <CustomModal
          title={t("user.logoutConfirm")}
          onDismiss={() => setVisible(false)}
          visible={visible}
          i18nIsDynamicList
          actions={[
            {
              label: t("user.logout"),
              icon: "logout",
              onPress: () => logout(),
            },
            {
              label: t("user.cancel"),
              onPress: () => setVisible(false),
            },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },

  // Header Card
  headerCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  headerContent: {
    padding: 24,
    gap: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userInfo: {
    alignItems: "center",
    gap: 4,
  },
  userName: {
    fontWeight: "700",
    textAlign: "center",
  },
  userEmail: {
    textAlign: "center",
    opacity: 0.9,
  },
  logoutButton: {
    marginTop: 8,
    borderRadius: 12,
  },

  // Form Container
  formContainer: {
    width: "100%",
  },

  // Settings Card
  settingsCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  settingsContent: {
    padding: 20,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  settingsTitle: {
    fontWeight: "700",
  },
  sectionDivider: {
    marginVertical: 16,
  },

  // Settings Sections
  settingSection: {
    gap: 12,
  },
  settingLabel: {
    fontWeight: "600",
    marginBottom: 4,
  },

  // Language Selector
  languageContainer: {
    flexDirection: "row",
    gap: 10,
  },
  languageButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    gap: 6,
  },
  languageFlag: {
    fontSize: 28,
  },
  languageName: {
    fontSize: 13,
  },

  // Theme Toggle
  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  themeLabel: {
    fontWeight: "600",
  },
});

export default UserScreen;
