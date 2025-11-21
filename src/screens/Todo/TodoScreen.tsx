import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { queryKeys } from "../../services/api/query-keys";
import { endpoints } from "../../services/api/endpoints";
import api from "../../services/api";
import { ITodo } from "../../model/todo/todo";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Badge, Card, FAB, IconButton, Text } from "react-native-paper";
import { usePreferences } from "../../context/ThemeProvider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppParamList } from "../../navigators/AppNavigator";
import { PageableResponse } from "../../model/types";
import Pagination from "@cherry-soft/react-native-basic-pagination";
import { SingleTodoItem } from "./components/SingleTodoItem";
import { TodosNotFound } from "./components/TodosNotFound";
import { TodoFooter } from "./components/TodoFooter";
import { TodoHeader } from "./components/TodoHeader";

const TodoScreen = () => {
  const { theme } = usePreferences();
  const navigation = useNavigation<NavigationProp<AppParamList>>();

  const [page, setPage] = useState(0);
  const [fabOpen, setFabOpen] = useState<boolean>(false);

  const pageSize = 10;

  const navTo = (data: ITodo) => {
    navigation.navigate("TodoPage", { todo: data });
  };

  const {
    data: pagedTodos,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [queryKeys.todo.findAll, page],
    queryFn: async () => {
      const res = await api.get<PageableResponse<ITodo>>(
        `${endpoints.todo.me}?page=${page}&size=${pageSize}`,
      );
      return res.data;
    },
  });

  const addTodo = async () => {
    console.log("Adding todo");
  };

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
            onPress: () => navigation.navigate("FormEditOrCreateTodo"),
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
