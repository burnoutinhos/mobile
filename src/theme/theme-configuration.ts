import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";

import merge from "deepmerge";
import { lightThemeColors } from "./light-theme";
import { darkThemeColors } from "./dark-theme";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export const lightTheme = merge(CombinedDefaultTheme, lightThemeColors);
export const darkTheme = merge(CombinedDarkTheme, darkThemeColors);
