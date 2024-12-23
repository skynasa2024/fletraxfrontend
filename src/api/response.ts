export interface ResponseModel<T> {
  success: boolean;
  message: string;
  result: T;
}
