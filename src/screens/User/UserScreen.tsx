import { SafeAreaView } from "react-native-safe-area-context";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import {
  ActivityIndicator,
  Text,
  Card,
  Avatar,
  Surface,
  Divider,
  IconButton,
  Switch,
} from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { CustomModal } from "../../components/Modal";
import { useAuth } from "../../context/AuthProvider";
import { usePreferences } from "../../context/ThemeProvider";
import { IUser } from "../../model/user/user";
import api from "../../services/api";
import { endpoints } from "../../services/api/endpoints";
import { queryKeys } from "../../services/api/query-keys";
import FormEditUser from "./subpages/FormEditUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const UserScreen = () => {
  const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    const changeLanguage = async (lang: string) => {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem("language", lang);

      // await new ProfileService(authToken).saveLanguagePreference(
      //   translateToExpectedSpringEnums(lang),
      // );
      setCurrentLanguage(lang);
    };

    const languages = [
      { code: "pt-BR", name: "Português", flag: "🇧🇷" },
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "es", name: "Español", flag: "🇪🇸" },
    ];

    const translateToExpectedSpringEnums = (lang: string) => {
      lang = lang.toUpperCase();

      switch (lang) {
        case "PT-BR":
          return "PTBR";
        case "EN":
          return lang;
        case "ES":
          return lang;
        default:
          return "PTBR";
      }
    };


  const [visible, setVisible] = useState(false);

  const { theme, toggleTheme } = usePreferences();
  const { logout } = useAuth();

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

  const handleLogout = () => {
    setVisible(true);
  };

  const handleEditImage = () => {
    console.log("Editar imagem");
  };

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

  console.log(user.data.profileImage);

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
            {/* Avatar com botões de ação */}
            <View style={styles.avatarRow}>
              {/* Botão Logout */}
              <IconButton
                icon="logout"
                size={28}
                iconColor={theme.colors.error}
                containerColor={theme.colors.errorContainer}
                onPress={handleLogout}
                style={styles.actionButton}
              />

              {/* Avatar Central */}
              <Surface
                style={[
                  styles.avatarContainer,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
                elevation={4}
              >
                {user.data.profileImage !== null ? (
                  <Pressable onPress={handleEditImage}>
                    <Avatar.Image
                      source={{ uri: user.data.profileImage }}
                      size={120}
                    />
                  </Pressable>
                ) : (
                  <Pressable onPress={handleEditImage}>
                    <Avatar.Text
                      size={120}
                      label={initial}
                      style={{
                        backgroundColor: theme.colors.primaryContainer,
                      }}
                      labelStyle={{
                        color: theme.colors.onPrimaryContainer,
                        fontWeight: "700",
                      }}
                    />
                  </Pressable>
                )}
              </Surface>

              {/* Botão Editar Imagem */}
              <IconButton
                icon="image-edit-outline"
                size={28}
                iconColor={theme.colors.primary}
                containerColor={theme.colors.primaryContainer}
                onPress={handleEditImage}
                style={styles.actionButton}
              />
            </View>

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

        {/* Language Selector */}
               <View style={[styles.actionsSection, { marginBottom: 16 }]}>
                 <Text style={[styles.infoLabel, { marginBottom: 12, color: theme.colors.onSurfaceVariant }]}>
                   {/*{t("language")}*/}
                   Escolha sua língua
                 </Text>
                 <View
                   style={{
                     flexDirection: "row",
                     justifyContent: "space-around",
                     gap: 8,
                   }}
                 >
                   {languages.map((lang) => (
                     <TouchableOpacity
                       key={lang.code}
                       onPress={() => changeLanguage(lang.code)}
                       style={{
                         flex: 1,
                         padding: 12,
                         borderRadius: 8,
                         backgroundColor:
                           currentLanguage === lang.code
                             ? theme.colors.primaryContainer
                             : theme.colors.background,
                         alignItems: "center",
                         borderWidth: 2,
                         borderColor:
                           currentLanguage === lang.code ? theme.colors.primaryContainer : "transparent",
                       }}
                     >
                       <Text style={{ fontSize: 24, marginBottom: 4}}>
                         {lang.flag}
                       </Text>
                       <Text
                         style={{
                           color:
                             currentLanguage === lang.code
                               ? theme.colors.onPrimaryContainer
                               : theme.colors.text,
                           fontSize: 12,
                           fontWeight:
                             currentLanguage === lang.code ? "bold" : "normal",
                         }}
                       >
                         {lang.name}
                       </Text>
                     </TouchableOpacity>
                   ))}
                 </View>
               </View>

               {/* Theme toggle */}
               <View style={[styles.actionsSection, { marginBottom: 16 }]}>
                 <View
                   style={{
                     flexDirection: "row",
                     justifyContent: "space-between",
                     alignItems: "center",
                   }}
                 >
                   <View>
                     <Text style={[styles.infoValue, { fontSize: 14, color: theme.colors.onSurfaceVariant }]}>
                       {/*{theme.dark
                         ? t("settings.themeDark")
                         : t("settings.themeLight")}*/}
                       Tema escuro
                     </Text>
                   </View>
                   <Switch
                     value={theme.dark}
                     onValueChange={toggleTheme}
                     trackColor={{ false: theme.colors.onSurfaceDisabled, true: theme.colors.primary }}
                     thumbColor={theme.colors.inversePrimary}
                   />
                 </View>
               </View>

        <CustomModal
          title="Deseja fazer logout?"
          onDismiss={() => setVisible(false)}
          visible={visible}
          actions={[{
            label: 'Logout',
            onPress: () => logout(),
          },
          {
            label: 'Cancelar',
            onPress: () => setVisible(false),
          }]}
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
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    borderRadius: 100,
    overflow: "hidden",
  },
  actionButton: {
    margin: 0,
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
  actionsSection: {
    padding: 16,
    backgroundColor: "transparent",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    width: "100%",
  },
});

export default UserScreen;
