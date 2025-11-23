import { useRef, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { FormikProps } from "formik";
import { ITodo } from "../../../model/todo/todo";
import { TodoType } from "../../../model/todo/TodoTypes";
import { ErrorResponseDTO } from "../../../model/types";
import { AppParamList } from "../../../navigators/AppNavigator";
import api from "../../../services/api";
import { endpoints } from "../../../services/api/endpoints";
import { queryKeys } from "../../../services/api/query-keys";
import { EnumTypeTodo } from "../../../services/Enums";
import { useTranslation } from "react-i18next";

export const useFormEditOrCreateTodo = (todo?: ITodo) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const queryClient = useQueryClient();
  const formikRef = useRef<FormikProps<TodoType> | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const typeOptions = [
    {
      label: t("todo.typeTask"),
      value: EnumTypeTodo.TODO,
      icon: "checkbox-marked-circle",
    },
    {
      label: t("todo.typeFocusMode"),
      value: EnumTypeTodo.FOCUS_MODE,
      icon: "brain",
    },
    { label: t("todo.typeRest"), value: EnumTypeTodo.REST, icon: "coffee" },
  ];

  // Mutation para atualizar (PUT)
  const {
    isPending: isPendingUpdate,
    error: errorUpdate,
    data: dataUpdate,
    mutate: mutateUpdate,
    reset: resetUpdate,
  } = useMutation<
    AxiosResponse<ITodo>,
    ErrorResponseDTO,
    { todoId: number; todoType: TodoType }
  >({
    mutationKey: [queryKeys.todo.put],
    mutationFn: async ({ todoId, todoType }) =>
      await api.put(endpoints.todo.put + `/${todoId}`, todoType),
  });

  // Mutation para criar (POST)
  const {
    isPending: isPendingCreate,
    error: errorCreate,
    data: dataCreate,
    mutate: mutateCreate,
    reset: resetCreate,
  } = useMutation<AxiosResponse<ITodo>, ErrorResponseDTO, TodoType>({
    mutationKey: [queryKeys.todo.create],
    mutationFn: async (form: TodoType) =>
      await api.post(endpoints.todo.post, form),
  });

  // Mutation para deletar (DELETE)
  const {
    isPending: isPendingDelete,
    error: errorDelete,
    data: dataDelete,
    mutate: mutateDelete,
    reset: resetDelete,
  } = useMutation<AxiosResponse, AxiosError, number>({
    mutationKey: [queryKeys.todo.delete],
    mutationFn: async (todoId: number) =>
      await api.delete(endpoints.todo.delete + `/${todoId}`),
    onSuccess: () => {
      // Fecha o modal de deleção
      setDeleteModalVisible(false);

      // Invalida a query de todos para atualizar a lista
      queryClient.invalidateQueries({
        queryKey: [queryKeys.todo.findAll],
      });

      // Navega de volta para a tela de Todos
      navigation.goBack();
    },
  });

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (todo?.id) {
      mutateDelete(todo.id);
    }
  };

  const handleSubmit = (values: TodoType) => {
    if (todo?.id) {
      mutateUpdate({ todoId: todo.id, todoType: values });
    } else {
      mutateCreate(values);
    }
  };

  return {
    // Refs
    formikRef,

    // States
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    menuVisible,
    setMenuVisible,
    deleteModalVisible,
    setDeleteModalVisible,

    // Data
    typeOptions,
    todo,
    navigation,

    // Mutations
    isPendingUpdate,
    errorUpdate,
    dataUpdate,
    mutateUpdate,
    resetUpdate,
    isPendingCreate,
    errorCreate,
    dataCreate,
    mutateCreate,
    resetCreate,
    isPendingDelete,
    errorDelete,
    dataDelete,
    mutateDelete,
    resetDelete,

    // Computed
    isPending: isPendingUpdate || isPendingCreate || isPendingDelete,
    error: errorUpdate || errorCreate || errorDelete,
    data: dataUpdate || dataCreate || dataDelete,

    // Actions
    handleDelete,
    handleConfirmDelete,
    handleSubmit,
  };
};
