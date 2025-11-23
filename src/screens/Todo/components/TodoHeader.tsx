import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { MergedTheme } from "../../../theme/types";
import { PageableResponse } from "../../../model/types";
import { ITodo } from "../../../model/todo/todo";
import { useTranslation } from "react-i18next";

export const TodoHeader = ({
  pagedTodos,
  theme,
}: {
  pagedTodos?: PageableResponse<ITodo>;
  theme: MergedTheme;
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.headerInfo}>
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {t("todo.totalTasks")}: {pagedTodos?.totalElements || 0}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerInfo: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
