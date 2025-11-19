import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Menu, useTheme, Badge } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { ParamListBase, Route } from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { usePreferences } from "../context/ThemeProvider";

type BackButtonProps = {
  title: string | undefined;
  href: string | undefined;
};

export type CustomNavigationBarProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: Route<string>;
  options: NativeStackNavigationOptions;
  back?: BackButtonProps;
  routesOptionsEnabled?: string[];
};

export default function CustomNavigationBar({
  navigation,
  route,
  options,
  back,
  routesOptionsEnabled = [],
}: CustomNavigationBarProps) {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const title = getHeaderTitle(options, route.name);
  const { theme } = usePreferences();

  const isRouteWithOptions = !!routesOptionsEnabled.find(
    (item) => item === route.name,
  );

  const unreadCount =
    (route &&
      (route.params as any) &&
      Number((route.params as any).unreadCount)) ||
    0;

  function handlePressNotifications() {
    navigation.navigate("Notifications" as any);
  }

  function handlePressSettings() {
    navigation.navigate("Settings" as any);
  }

  return (
    <Appbar.Header
      style={[styles.header, { backgroundColor: theme.colors.surface }]}
    >
      {back ? (
        <Appbar.BackAction
          onPress={navigation.goBack}
          color={theme.colors.primary}
        />
      ) : null}
      <Appbar.Content
        title={title}
        titleStyle={{ color: theme.colors.primary }}
      />
      <View style={styles.iconWrap}>
        <Appbar.Action
          icon="cog-outline"
          onPress={handlePressSettings}
          accessibilityLabel="Configurações"
        />
        <Appbar.Action
          icon="bell"
          onPress={handlePressNotifications}
          accessibilityLabel="Notificações"
        />
        {unreadCount > 0 && (
          <Badge
            style={[styles.badge, { backgroundColor: theme.colors.primary }]}
          >
            {unreadCount}
          </Badge>
        )}
      </View>

      {isRouteWithOptions ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
        >
          <Menu.Item
            onPress={() => {
              console.log("Option 1 was pressed");
              closeMenu();
            }}
            title="Compartilhar"
          />
          <Menu.Item
            onPress={() => {
              console.log("Option 2 was pressed");
              closeMenu();
            }}
            title="Outra opção"
          />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 2,
  },
  iconWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    flexDirection: "row",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    textAlign: "center",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
