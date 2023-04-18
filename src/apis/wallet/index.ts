import { request } from '@/utils/request';

export function walletPayment(params) {
  return request({
    url: '/wallet/pay/',
    method: 'get',
    params
  })
}

export default {
  // 钱包支付
  walletPayment
}
