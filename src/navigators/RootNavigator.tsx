import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthProvider";
import { AuthNavigator } from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

export const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
