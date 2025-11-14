import { IUser } from "../user/user";

export interface AuthResponse {
  error: boolean;
  message: string;
  data?: {
    token: string;
  };
}

export interface UserResponse {
  error: boolean;
  message: string;
  data?: {
    user: IUser
  }
}
