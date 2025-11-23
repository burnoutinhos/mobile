import * as yup from "yup";
import { ITodo } from "../todo/todo";

const getMaxMinutesSchema = (t: (key: string) => string) =>
  yup.object().shape({
    max: yup
      .number()
      .required(t("chronometerValidation.maxTimeRequired"))
      .min(1, t("chronometerValidation.minTimeOne")),
  });

type MaxMinutesType = {
  max: number;
};

const getTimeBlockSchema = (t: (key: string) => string) =>
  yup.object().shape({
    id: yup.number().optional(),
    name: yup
      .string()
      .min(3, t("chronometerValidation.nameMinLength"))
      .required(t("chronometerValidation.nameRequired")),
    timeCount: yup
      .number()
      .required(t("chronometerValidation.timeCountRequired")),
    type: yup
      .string()
      .oneOf(["CRONOMETER", "TEMPORIZER"])
      .required(t("chronometerValidation.typeRequired")),
    max: yup
      .number()
      .required(t("chronometerValidation.maxRequired"))
      .min(1, t("chronometerValidation.minTimeOne")),
    start: yup.number().required(t("chronometerValidation.startRequired")),
    todoId: yup.number().required(t("chronometerValidation.todoIdRequired")),
  });

type TimeBlockDto = {
  id?: number;
  name: string;
  timeCount: number;
  type: string;
  max: number;
  start: number;
  todoId: number;
};

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
  getMaxMinutesSchema,
  TimeBlockDto,
  getTimeBlockSchema,
  ITimeBlock,
};
