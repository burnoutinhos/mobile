import { IUser } from "../user/user"


export interface ISuggestion {
  id: number
  suggestion: string
  user_id: IUser
  created_at: Date
}