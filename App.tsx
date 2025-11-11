import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./src/navigators/StackNavigator";
import {
  PreferencesProvider,
  usePreferences,
} from "./src/context/ThemeProvider";
import { AuthProvider } from "./src/context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  const { theme } = usePreferences();

  return (
    <PaperProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <PreferencesProvider>
          <AuthProvider>
            <StackNavigator />
          </AuthProvider>
        </PreferencesProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
