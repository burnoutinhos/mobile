import * as yup from "yup";
import { EnumTypeTodo } from "../../services/Enums";

const TodoSchema = yup.object().shape({
  name: yup.string().optional(),
  start: yup.date().optional(),
  end: yup.date().optional(),
  description: yup.string().optional(),
  type: yup.mixed<EnumTypeTodo>().oneOf(Object.values(EnumTypeTodo) as EnumTypeTodo[], "Tipo inválido").optional(),
  isCompleted: yup.number().optional()
})

type TodoType = yup.InferType<typeof TodoSchema>

const emptyTodoForm: TodoType = {
  name: "",
  start: new Date(),
  end: new Date(),
  description: "",
  type: EnumTypeTodo.TODO,
  isCompleted: 0
}

export {TodoSchema, TodoType, emptyTodoForm}