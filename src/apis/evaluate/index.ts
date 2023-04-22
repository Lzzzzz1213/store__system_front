import { request } from '@/utils/request';

export function orderReputation(data: any) {
  return request({
    url: "/evaluate/add/",
    method: 'post',
    data: data,
  });
}

export function getOrderReputationByOderId(id: any) {
  return request({
    url: `/evaluate/state/${id}/`,
    method: 'get'
  })
}

export default {
  orderReputation,
  getOrderReputationByOderId
}
