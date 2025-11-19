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
import { CronometerScreen } from "../screens/Cronometer";
import { ITodo } from "../model/todo/todo";
import TodoScreen from "../screens/TodoScreen";
import TodoPage from "../screens/TodoPage";


export type AppParamList = {
  Home: undefined;
  Notifications: undefined;
  Cronometer: undefined;
  SignIn: undefined;
  Login: undefined;
  User: undefined;
  Todo: undefined;
  TodoPage: { todo: ITodo };
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
        component={HomeScreen}
        options={{ title: "Burnoutinhos" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notificações" }}
      />
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ title: "Configurações" }}
      />
      <Stack.Screen
        name="Cronometer"
        component={CronometerScreen}
        options={{ title: "Cronômetro" }}
      />
      <Stack.Screen
        name="Todo"
        component={TodoScreen}
        options={{ title: "Todo" }}
      />
      <Stack.Screen
        name="TodoPage"
        component={TodoPage}
        options={{ title: "Pagina todo" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
