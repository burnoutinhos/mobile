import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { usePreferences } from "../context/ThemeProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppParamList } from "../navigators/AppNavigator";
import { useAuth } from "../context/AuthProvider";

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<AppParamList>>();

  const { logout } = useAuth();

  const { theme } = usePreferences();
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, gap: 16 },
      ]}
    >
      <Text theme={theme} style={[styles.title]}>
        Home
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Cronometer")}
        style={styles.button}
      >
        Cronômetro
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Todo")}
        style={styles.button}
      >
        Ver Todos
      </Button>

      <Button
        mode="contained"
        onPress={logout}
        style={styles.button}
      >
        Deslogar
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 16,
  },
  button: {
    alignSelf: "stretch",
    borderRadius: 8,
    paddingVertical: 6,
  },
});

export default HomeScreen;
