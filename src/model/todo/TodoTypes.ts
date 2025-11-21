import * as yup from "yup";
import { EnumTypeTodo } from "../../services/Enums";

const TodoSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  start: yup.date().required("Data de início é obrigatória"),
  end: yup.date().required("Data de término é obrigatória"),
  description: yup.string().optional(),
  type: yup.mixed<EnumTypeTodo>().oneOf(Object.values(EnumTypeTodo) as EnumTypeTodo[], "Tipo inválido").optional(),
  isCompleted: yup.boolean().optional()
})

type TodoType = yup.InferType<typeof TodoSchema>

const emptyTodoForm: TodoType = {
  name: "",
  start: new Date(),
  end: new Date(),
  description: "",
  type: EnumTypeTodo.TODO,
  isCompleted: false
}

export {TodoSchema, TodoType, emptyTodoForm}
