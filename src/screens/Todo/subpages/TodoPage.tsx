import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { usePreferences } from "../../../context/ThemeProvider";
import { AppParamList } from "../../../navigators/AppNavigator";
import FormEditOrCreateTodo from "./FormEditOrCreateTodo";

const TodoPage = () => {
  const route = useRoute<RouteProp<AppParamList, "TodoPage">>();

  const { theme } = usePreferences();

  const todo = route.params.todo;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%" }}>
          <FormEditOrCreateTodo todo={todo} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardContent: {
    paddingTop: 0,
  },
});

export default TodoPage;
