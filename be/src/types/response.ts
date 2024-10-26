interface BaseResponse {
  status: number;
  // code: string;
}

export interface IResponse<T> extends BaseResponse {
  data: T;
}

export interface IResponseError extends BaseResponse {
  errors: string[];
}
