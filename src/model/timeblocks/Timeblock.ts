import * as yup from "yup";
import { ITodo } from "../todo/todo";

const MaxMinutesSchema = yup.object().shape({
  max: yup
    .number()
    .required("Tempo máximo deve ser preenchido")
    .min(1, "O mínimo é de um minuto"),
});

type MaxMinutesType = yup.InferType<typeof MaxMinutesSchema>;

const TimeBlockSchema = yup.object().shape({
  id: yup.number().optional(),
  name: yup.string().min(3).required("Nome deve ser preenchido"),
  timeCount: yup.number().required("Tempo deve ser preenchido"),
  type: yup
    .string()
    .oneOf(["CRONOMETER", "TEMPORIZER"])
    .required("Tipo deve ser preenchido"),
  max: yup
    .number()
    .required("Tempo máximo deve ser preenchido")
    .min(1, "O mínimo é de um minuto"),
  start: yup.number().required("Tempo inicial deve ser preenchido"),
  todoId: yup.number().required("ID da tarefa deve ser preenchido"),
});

type TimeBlockDto = yup.InferType<typeof TimeBlockSchema>;

interface ITimeBlock {
  id: number; // int64
  name: string;
  timeCount: number; // int32
  max: number; // int32
  start: number; // int32
  type: "CRONOMETER" | "TEMPORIZER";
  todo: ITodo | null; // referência ao objeto Todo
  createdAt: string; // date-time ISO
  updatedAt: string; // date-time ISO
}

export {
  MaxMinutesType,
  MaxMinutesSchema,
  TimeBlockDto,
  TimeBlockSchema,
  ITimeBlock,
};
