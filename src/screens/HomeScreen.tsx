import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { usePreferences } from "../context/ThemeProvider";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
        onPress={() => {
          navigation.navigate("SignIn");
        }}
        style={[styles.button]}
      >
        Abrir tela de registro
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate("Login");
        }}
        style={[styles.button]}
      >
        Abrir tela de login
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
