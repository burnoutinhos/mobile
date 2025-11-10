// import { ThemeProp } from "react-native-paper/lib/typescript/types";

// export type MergedTheme = ThemeProp & ReactNavigation.Theme;

import { MD3Theme as PaperTheme } from "react-native-paper/lib/typescript/types";
import { Theme as NavigationTheme } from "@react-navigation/native";

export type MergedTheme = PaperTheme & NavigationTheme;
