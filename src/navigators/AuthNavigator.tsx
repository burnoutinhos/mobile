import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CustomNavigationBar from "../components/Appbar";
import { usePreferences } from "../context/ThemeProvider";

export type AuthParamList = {
  Register: undefined;
  Login: undefined;
};

export const AuthNavigator = () => {
  const { theme } = usePreferences();
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
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};
