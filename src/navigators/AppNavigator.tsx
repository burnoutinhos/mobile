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
import { HomeNavigator } from "./HomeNavigator";

export type AppParamList = {
  Home: undefined;
  Notifications: undefined;
  User: undefined;
};

const Stack = createNativeStackNavigator<AppParamList>();

const AppNavigator = () => {
  const { theme } = usePreferences();

  return (
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
        component={HomeNavigator}
        options={{ title: "Burnoutinhos 🫩" }}
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
