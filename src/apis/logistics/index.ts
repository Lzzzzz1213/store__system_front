import { request } from '@/utils/request';

export function getOrderLogistics(id: any) {
  return request({
    url: `/logistics/detail/${id}/`,
    method: 'get'
  })

}

export default {
  getOrderLogistics
}
