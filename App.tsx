import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./src/navigators/StackNavigator";
import { PreferencesProvider } from "./src/context/ThemeProvider";
import { AuthProvider } from "./src/context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </PreferencesProvider>
    </QueryClientProvider>
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
