import React from "react";
import { MergedTheme } from "../theme/types";

export interface PreferencesContextProps {
  toggleTheme: () => void;
  theme: MergedTheme;
}

export const PreferencesContext = React.createContext<PreferencesContextProps>(
  {} as PreferencesContextProps,
);

export interface PreferencesProviderProps {
  children: React.ReactNode;
}
