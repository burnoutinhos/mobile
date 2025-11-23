import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import CustomNavigationBar from "../components/Appbar";
import { usePreferences } from "../context/ThemeProvider";
import LoginScreen from "../screens/Login/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";

export type AuthParamList = {
  Register: undefined;
  Login: undefined;
};

export const AuthNavigator = () => {
  const { theme } = usePreferences();
  const { t } = useTranslation();
  const Stack = createNativeStackNavigator<AuthParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Login"
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
        name="Login"
        component={LoginScreen}
        options={{ title: t("navigation.login") }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: t("navigation.register") }}
      />
    </Stack.Navigator>
  );
};
