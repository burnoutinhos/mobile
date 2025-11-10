import { useColorScheme } from "react-native";

import { darkTheme, lightTheme } from "../theme/theme-configuration";
import { PreferencesContext, PreferencesProviderProps } from "./types";
import { MergedTheme } from "../theme/types";
import { useContext, useState } from "react";

export const PreferencesProvider = ({ children }: PreferencesProviderProps) => {
  const colorScheme = useColorScheme();

  const [isThemeDark, setIsThemeDark] = useState(colorScheme == "dark");

  const toggleTheme = () => {
    setIsThemeDark(!isThemeDark);
  };

  let theme: MergedTheme = isThemeDark ? lightTheme : darkTheme;

  return (
    <PreferencesContext.Provider value={{ toggleTheme, theme }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
