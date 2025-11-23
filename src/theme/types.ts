// import { ThemeProp } from "react-native-paper/lib/typescript/types";

// export type MergedTheme = ThemeProp & ReactNavigation.Theme;

import { MD3Theme as PaperTheme } from "react-native-paper/lib/typescript/types";
import { Theme as NavigationTheme } from "@react-navigation/native";

export type MergedTheme = PaperTheme &
  NavigationTheme & {
    colors: PaperTheme["colors"] &
      NavigationTheme["colors"] & {
        success: string;
        onSuccess: string;
        successContainer: string;
        info: string;
        onInfo: string;
        infoContainer: string;
        warning: string;
        onWarning: string;
        warningContainer: string;
      };
  };
