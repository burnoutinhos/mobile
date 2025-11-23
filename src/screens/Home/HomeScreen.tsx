import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, Text, Card, Avatar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { usePreferences } from "../../context/ThemeProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppParamList } from "../../navigators/AppNavigator";

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const { theme } = usePreferences();
  const { t } = useTranslation();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text
            variant="headlineMedium"
            style={{ color: theme.colors.primary, fontWeight: "bold" }}
          >
            {t("home.welcome")}
          </Text>
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {t("home.subtitle")}
          </Text>
        </View>

        <View style={styles.grid}>
          <Card
            style={[
              styles.card,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => navigation.navigate("Timeblocks")}
            mode="elevated"
          >
            <Card.Content style={styles.cardContent}>
              <Avatar.Icon
                size={56}
                icon="timer-outline"
                style={{ backgroundColor: theme.colors.primaryContainer }}
                color={theme.colors.onPrimaryContainer}
              />
              <Text
                variant="titleMedium"
                style={[
                  styles.cardTitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t("home.chronometer")}
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => navigation.navigate("Todo")}
            mode="elevated"
          >
            <Card.Content style={styles.cardContent}>
              <Avatar.Icon
                size={56}
                icon="format-list-checks"
                style={{ backgroundColor: theme.colors.secondaryContainer }}
                color={theme.colors.onSecondaryContainer}
              />
              <Text
                variant="titleMedium"
                style={[
                  styles.cardTitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t("home.tasks")}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("User")}
            icon="account-box"
            style={styles.logoutButton}
            textColor={theme.colors.primary}
          >
            {t("home.viewProfile")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginBottom: 40,
    marginTop: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    marginBottom: 16,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 16,
  },
  cardTitle: {
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 40,
    alignItems: "center",
  },
  logoutButton: {
    borderColor: "transparent",
    width: "100%",
  },
});

export default HomeScreen;
