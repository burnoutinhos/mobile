import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { MergedTheme } from "../../../theme/types";

export const TodosNotFound = ({theme} : {theme: MergedTheme}) => (
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
      Nenhuma tarefa criada
    </Text>
  </View>
);

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    minHeight: 400,
  },
});
