import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CustomNavigationBar from "../components/Appbar";
import { usePreferences } from "../context/ThemeProvider";
import { ITimeBlock } from "../model/timeblocks/Timeblock";
import { ITodo } from "../model/todo/todo";
import Timeblocks from "../screens/Cronometer/Timeblocks";
import { CronometerScreen } from "../screens/Cronometer/subpages/Cronometer";
import HomeScreen from "../screens/HomeScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import TodoScreen from "../screens/Todo/TodoScreen";
import FormEditOrCreateTodo from "../screens/Todo/subpages/FormEditOrCreateTodo";
import TodoPage from "../screens/Todo/subpages/TodoPage";
import UserScreen from "../screens/User/UserScreen";

export type AppParamList = {
  Home: undefined;
  Notifications: undefined;
  Cronometer: { timeblock: ITimeBlock } | undefined;
  SignIn: undefined;
  Login: undefined;
  User: undefined;
  Todo: undefined;
  TodoPage: { todo: ITodo };
  FormEditOrCreateTodo: { todo: ITodo } | undefined;
  Timeblocks: undefined;
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
      <Stack.Screen
        name="FormEditOrCreateTodo"
        component={FormEditOrCreateTodo}
        options={{ title: "Criar tarefa" }}
      />
      <Stack.Screen
        name="Timeblocks"
        component={Timeblocks}
        options={{ title: "Blocos de tempo" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
