export interface HttpResult<T = any> {
  status: number;
  message?: string;
  response?: T;
}

export interface ServiceResult<T = any> {
  id: any;
  state: number;
  sum: number;
  balance: number;
  total: any;
  detail: string;
  code: number;
  msg: string;
  data?: T;

  pic?: T;
}
