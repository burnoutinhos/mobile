import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MergedTheme } from "../../../../theme/types";
import { PageableResponse } from "../../../../model/types";
import { ITimeBlock } from "../../../../model/timeblocks/Timeblock";
import { useTranslation } from "react-i18next";

interface TimeBlocksHeaderProps {
  theme: MergedTheme;
  pagedTimeblocks?: PageableResponse<ITimeBlock>;
}

export const TimeBlocksHeader = ({
  theme,
  pagedTimeblocks,
}: TimeBlocksHeaderProps) => {
  const { t } = useTranslation();

  if (!pagedTimeblocks || pagedTimeblocks.content.length === 0) return null;

  const recordsLabel =
    pagedTimeblocks.totalElements === 1
      ? t("cronometer.recordsFound")
      : t("cronometer.recordsFoundPlural");
  const foundLabel =
    pagedTimeblocks.totalElements === 1
      ? t("cronometer.found")
      : t("cronometer.foundPlural");

  return (
    <View style={styles.headerContainer}>
      <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
        {t("cronometer.timeRecords")}
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
        {pagedTimeblocks.totalElements} {recordsLabel} {foundLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 16,
    gap: 4,
  },
});
