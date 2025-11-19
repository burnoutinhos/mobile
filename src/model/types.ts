export type ErrorResponseDTO = {
  code: number;
  message: string;
  errors: FieldError[];
};

export type FieldError = {
  field: string;
  message: string;
};
