import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { MergedTheme } from "../../../theme/types";
import { useTranslation } from "react-i18next";

export const TodosNotFound = ({ theme }: { theme: MergedTheme }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.empty}>
      <IconButton
        icon="checkbox-marked-circle-auto-outline"
        size={64}
        iconColor={theme.colors.outline}
      />
      <Text
        variant="bodyLarge"
        style={{ color: theme.colors.onSurfaceDisabled, marginTop: 8 }}
      >
        {t("todo.noTasks")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    minHeight: 400,
  },
});
