import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MergedTheme } from "../../../../theme/types";
import { PageableResponse } from "../../../../model/types";
import { ITimeBlock } from "../../../../model/timeblocks/Timeblock";

interface TimeBlocksHeaderProps {
  theme: MergedTheme;
  pagedTimeblocks?: PageableResponse<ITimeBlock>;
}

export const TimeBlocksHeader = ({
  theme,
  pagedTimeblocks,
}: TimeBlocksHeaderProps) => {
  if (!pagedTimeblocks || pagedTimeblocks.content.length === 0) return null;

  return (
    <View style={styles.headerContainer}>
      <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
        Registros de Tempo
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
        {pagedTimeblocks.totalElements} registro
        {pagedTimeblocks.totalElements !== 1 ? "s" : ""} encontrado
        {pagedTimeblocks.totalElements !== 1 ? "s" : ""}
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
