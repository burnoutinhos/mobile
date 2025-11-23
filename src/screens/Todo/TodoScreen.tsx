import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreferences } from "../../context/ThemeProvider";
import { SingleTodoItem } from "./components/SingleTodoItem";
import { TodoFooter } from "./components/TodoFooter";
import { TodoHeader } from "./components/TodoHeader";
import { TodosNotFound } from "./components/TodosNotFound";
import { useTodo } from "./controllers/TodoController";

const TodoScreen = () => {
  const { theme } = usePreferences();

  const {
    page,
    setPage,
    fabOpen,
    setFabOpen,
    pagedTodos,
    navigation,
    isLoading,
    isFetching,
    refetch,
    handleCreateTodo,
  } = useTodo();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerActions}></View>
      </View>

      <FlatList
        data={pagedTodos?.content || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SingleTodoItem item={item} navigation={navigation} theme={theme} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isFetching}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.background}
          />
        }
        ListEmptyComponent={() => <TodosNotFound theme={theme} />}
        ListHeaderComponent={
          pagedTodos && pagedTodos.content.length > 0 ? (
            <TodoHeader theme={theme} pagedTodos={pagedTodos} />
          ) : null
        }
        ListFooterComponent={() => (
          <TodoFooter page={page} setPage={setPage} pagedTodos={pagedTodos} />
        )}
      />

      <FAB.Group
        open={fabOpen}
        visible
        icon={fabOpen ? "pencil" : "plus"}
        onStateChange={({ open }) => setFabOpen(open)}
        style={styles.fabGroup}
        actions={[
          {
            icon: "plus",
            onPress: handleCreateTodo,
            label: "Adicione uma tarefa",
          },
        ]}
      />
    </SafeAreaView>
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
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
  fabGroup: { position: "absolute", right: 16, bottom: 24 },
});

export default TodoScreen;
