import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import CustomNavigationBar from "../components/Appbar";
import { usePreferences } from "../context/ThemeProvider";
import { ITimeBlock } from "../model/timeblocks/Timeblock";
import { ITodo } from "../model/todo/todo";
import Timeblocks from "../screens/Cronometer/Timeblocks";
import { CronometerScreen } from "../screens/Cronometer/subpages/Cronometer";
import TodoScreen from "../screens/Todo/TodoScreen";
import FormEditOrCreateTodo from "../screens/Todo/subpages/FormEditOrCreateTodo";
import TodoPage from "../screens/Todo/subpages/TodoPage";
import UserScreen from "../screens/User/UserScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import NotificationsScreen from "../screens/Notifications/NotificationsScreen";

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
  const { t } = useTranslation();

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
        options={{ title: t("navigation.home") }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: t("navigation.notifications") }}
      />
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ title: t("navigation.user") }}
      />
      <Stack.Screen
        name="Cronometer"
        component={CronometerScreen}
        options={{ title: t("navigation.cronometer") }}
      />
      <Stack.Screen
        name="Todo"
        component={TodoScreen}
        options={{ title: t("navigation.todo") }}
      />
      <Stack.Screen
        name="TodoPage"
        component={TodoPage}
        options={{ title: t("navigation.todoPage") }}
      />
      <Stack.Screen
        name="FormEditOrCreateTodo"
        component={FormEditOrCreateTodo}
        options={{ title: t("navigation.createTodo") }}
      />
      <Stack.Screen
        name="Timeblocks"
        component={Timeblocks}
        options={{ title: t("navigation.timeblocks") }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
