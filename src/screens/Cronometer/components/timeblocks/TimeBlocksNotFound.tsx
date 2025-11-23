import { View, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { MergedTheme } from "../../../../theme/types";
import { useTranslation } from "react-i18next";

interface TimeBlocksNotFoundProps {
  theme: MergedTheme;
}

export const TimeBlocksNotFound = ({ theme }: TimeBlocksNotFoundProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.empty}>
      <IconButton
        icon="timer-off-outline"
        size={64}
        iconColor={theme.colors.outline}
      />
      <Text
        variant="titleMedium"
        style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
      >
        {t("cronometer.noRecordsFound")}
      </Text>
      <Text
        variant="bodyMedium"
        style={{
          color: theme.colors.outline,
          marginTop: 4,
          textAlign: "center",
        }}
      >
        {t("cronometer.noRecordsDescription")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
});
