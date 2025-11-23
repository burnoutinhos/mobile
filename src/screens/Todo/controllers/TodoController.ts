import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ITodo } from "../../../model/todo/todo";
import { PageableResponse } from "../../../model/types";
import { AppParamList } from "../../../navigators/AppNavigator";
import api from "../../../services/api";
import { endpoints } from "../../../services/api/endpoints";
import { queryKeys } from "../../../services/api/query-keys";

export const useTodo = () => {
  const navigation = useNavigation<NavigationProp<AppParamList>>();

  const [page, setPage] = useState(0);
  const [fabOpen, setFabOpen] = useState<boolean>(false);

  const pageSize = 10;

  const {
    data: pagedTodos,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [queryKeys.todo.findAll, page],
    queryFn: async () => {
      const res = await api.get<PageableResponse<ITodo>>(
        endpoints.todo.me(page, pageSize),
      );
      return res.data;
    },
  });

  const handleCreateTodo = () => {
    navigation.navigate("FormEditOrCreateTodo");
  };

  return {
    // States
    page,
    setPage,
    fabOpen,
    setFabOpen,
    pagedTodos,
    navigation,

    // Query states
    isLoading,
    isFetching,
    refetch,

    // Actions
    handleCreateTodo,
  };
};
