import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/AuthProvider";
import { usePreferences } from "../../../context/ThemeProvider";
import { IUser } from "../../../model/user/user";
import api from "../../../services/api";
import { endpoints } from "../../../services/api/endpoints";
import { queryKeys } from "../../../services/api/query-keys";

export const useUser = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
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

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("language", lang);
    setCurrentLanguage(lang);
  };

  const handleLogout = () => {
    setVisible(true);
  };

  const getInitial = () => {
    if (!user?.data?.name?.trim() || user.data.name.trim().length === 0) {
      return "?";
    }
    return user.data.name.trim().charAt(0).toUpperCase();
  };

  return {
    // States
    visible,
    setVisible,
    currentLanguage,
    theme,
    toggleTheme,

    // Query
    user,
    isLoading,
    error,
    isRefetching,
    refetch,

    // Data
    languages,
    t,
    i18n,

    // Actions
    logout,
    handleLogout,
    changeLanguage,
    getInitial,
    translateToExpectedSpringEnums,
  };
};
