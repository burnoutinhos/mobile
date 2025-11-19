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
  user_id: IUser
  suggestion: ISuggestion
  isCompleted: number
  createdAt: Date
  updatedAt: Date
}