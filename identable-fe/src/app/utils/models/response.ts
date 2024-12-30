export interface ResponseModel {
  statusCode: number;
  status?: number;
  data: any;
  message: string;
  code: number;
  property: any;
  type: string;
  error_message: any;
}
export interface ListResponseModel {
  code: number;
  data: any;
  result: any;
  message: string;
  msg: string;
  status: string;
  totalrecord: number;
  itemperpage: number;
  totalResult: number;
  count: number;
  duplicate: any;
  dmDetails: any;
}
