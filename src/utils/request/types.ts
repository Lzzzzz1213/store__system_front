export interface HttpResult<T = any> {
  status: number;
  message?: string;
  response?: T;
}

export interface ServiceResult<T = any> {
  detail: string;
  code: number;
  msg: string;
  data?: T;

  pic?: T;
}
