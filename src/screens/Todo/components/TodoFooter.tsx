import Pagination from "@cherry-soft/react-native-basic-pagination";
import { StyleSheet, View } from "react-native";
import { PageableResponse } from "../../../model/types";
import { ITodo } from "../../../model/todo/todo";

export const TodoFooter = ({ pagedTodos, page, setPage }: { pagedTodos?:  PageableResponse<ITodo> ; page: number; setPage: (page: number) => void }) => {
  if (!pagedTodos || pagedTodos.totalPages <= 1) {
    return null;
  }

  return (
    <View style={styles.paginationContainer}>
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        pageSize={pagedTodos.size}
        totalItems={pagedTodos.totalElements}
        showLastPagesButtons={pagedTodos.totalPages > 5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
