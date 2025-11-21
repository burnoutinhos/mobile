import { EnumTypeTodo } from "../../services/Enums";
import { ISuggestion } from "../suggestion/suggestion";
import { IUser } from "../user/user";

export interface ITodo {
  id: number;
  name: string;
  start: Date
  end: Date
  description: string
  type: EnumTypeTodo
  userId: IUser
  suggestion: ISuggestion
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
}
