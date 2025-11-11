export interface AuthResponse {
  error: boolean;
  message: string;
  data?: {
    token: string;
  };
}
