import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "../screens/UserScreen";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import { usePreferences } from "../context/ThemeProvider";
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export type HomeParamList = {
  Home: undefined;
  Settings: undefined;
};

export const HomeNavigator = () => {
  const { theme } = usePreferences();
  const Tab = createBottomTabNavigator<HomeParamList>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
