import * as yup from "yup";
import { EnumTypeTodo } from "../../services/Enums";

const getTodoSchema = (t: (key: string) => string) =>
  yup.object().shape({
    name: yup.string().required(t("todoValidation.nameRequired")),
    start: yup.date().required(t("todoValidation.startDateRequired")),
    end: yup.date().required(t("todoValidation.endDateRequired")),
    description: yup.string().optional(),
    type: yup
      .mixed<EnumTypeTodo>()
      .oneOf(
        Object.values(EnumTypeTodo) as EnumTypeTodo[],
        t("todoValidation.invalidType"),
      )
      .optional(),
    isCompleted: yup.boolean().optional(),
  });

type TodoType = {
  name: string;
  start: Date;
  end: Date;
  description?: string;
  type?: EnumTypeTodo;
  isCompleted?: boolean;
};

const emptyTodoForm: TodoType = {
  name: "",
  start: new Date(),
  end: new Date(),
  description: "",
  type: EnumTypeTodo.TODO,
  isCompleted: false,
};

export { getTodoSchema, TodoType, emptyTodoForm };
