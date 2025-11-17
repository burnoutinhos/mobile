import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import { usePreferences } from "../context/ThemeProvider";
import CustomNavigationBar from "../components/Appbar";
import NotificationsScreen from "../screens/NotificationsScreen";
import UserScreen from "../screens/UserScreen";

export type StackParamsList = {
  Home: undefined;
  Notifications: undefined;
  SignIn: undefined;
  Login: undefined;
  User: undefined;
};

const Stack = createNativeStackNavigator<StackParamsList>();

const StackNavigator = () => {
  const { theme } = usePreferences();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: (props) => (
            <CustomNavigationBar
              {...props}
              routesOptionsEnabled={["Notifications"]}
            />
          ),
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.primary ?? theme.colors.text,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Início" }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: "Notificações" }}
        />
        <Stack.Screen
          name="User"
          component={UserScreen}
          options={{ title: "User" }}
        />
        <Stack.Screen
          name="SignIn"
          component={RegisterScreen}
          options={{ title: "Registrar" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Logar" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
