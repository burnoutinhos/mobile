import { SafeAreaView } from "react-native-safe-area-context";
import { usePreferences } from "../context/ThemeProvider";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Text,
  Card,
  Avatar,
  Surface,
  Divider,
} from "react-native-paper";
import { IUser } from "../model/user/user";
import FormEditUser from "../components/FormEditUser";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../services/api/query-keys";
import api from "../services/api";
import { endpoints } from "../services/api/endpoints";
import { AxiosError, AxiosResponse } from "axios";

const UserScreen = () => {
  const { theme } = usePreferences();

  const {
    refetch,
    isLoading,
    error,
    data: user,
    isRefetching,
  } = useQuery<AxiosResponse<IUser>, AxiosError>({
    queryKey: [queryKeys.user.user],
    queryFn: async () => {
      return await api.get(endpoints.user.userInfo);
    },
  });

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
          Carregando perfil...
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
          Usuário não encontrado
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onBackground, textAlign: "center" }}
        >
          Não foi possível carregar as informações do perfil.
        </Text>
      </SafeAreaView>
    );
  }

  console.log(user);

  const initial =
    user.data?.name?.trim() && user.data.name.trim().length > 0
      ? user.data.name.trim().charAt(0).toUpperCase()
      : "?";


  console.log(user.data.profileImage)

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
        {/* Card do Perfil */}
        <Card
          style={[
            styles.profileCard,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={2}
        >
          <Card.Content style={styles.profileCardContent}>
            {/* Avatar */}
            <Surface
              style={[
                styles.avatarContainer,
                // { backgroundColor: theme.colors.surfaceVariant },
              ]}
              elevation={4}
            >
              {user.data.profileImage !== null ? (
                <Avatar.Image
                  source={{ uri: user.data.profileImage }}
                  size={120}
                  style={styles.avatar}
                />
              ) : (
                  <Avatar.Text
                    size={120}
                    label={initial}
                    style={{
                      backgroundColor: theme.colors.primaryContainer,
                      borderRadius: 100,
                    }}
                    labelStyle={{
                      color: theme.colors.onPrimaryContainer,
                      // fontSize: 56,
                      fontWeight: "700",
                    }}
                  />
              )}
            </Surface>

            {/* Nome e Email */}
            <View style={styles.userInfoSection}>
              <Text
                variant="headlineMedium"
                style={[styles.userName, { color: theme.colors.onSurface }]}
              >
                {user.data.name}
              </Text>
              <Text
                variant="bodyLarge"
                style={[
                  styles.userEmail,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {user.data.email}
              </Text>
            </View>

            <Divider style={styles.divider} />
          </Card.Content>
        </Card>

        {/* Formulário de Edição */}
        <View style={styles.formContainer}>
          <FormEditUser user={user.data} />
        </View>
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
  },
  loadingText: {
    marginTop: 16,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  profileCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  profileCardContent: {
    alignItems: "center",
    padding: 24,
  },
  avatarContainer: {
    borderRadius: 100,
    marginBottom: 16,
    overflow: "hidden",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  userEmail: {
    textAlign: "center",
  },
  divider: {
    width: "100%",
    marginTop: 8,
  },
  formContainer: {
    width: "100%",
  },
});

export default UserScreen;
