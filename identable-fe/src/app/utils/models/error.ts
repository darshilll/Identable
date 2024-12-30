import { ResponseModel } from './response';
import { ListResponseModel } from './response';
export interface ErrorModel {
  error: ResponseModel;
  headers: object;
  status: number;
  message: string;
}
export interface ListErrorModel {
  error: ListResponseModel;
  headers: object;
  status: string;
  message: string;
}
