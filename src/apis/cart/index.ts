import { request } from '@/utils/request';
import { ServiceResult } from '@/utils/request/types';
import { shoppingCartResult } from './typings';

/**
 * 加入购物车
 */
export function shoppingCartAdd(data) {
  return request({
    url: '/cart/cartput/',
    method: 'post',
    data: data,
  });
}

/**
 * 清空购物车
 */
export function shoppingCartEmpty(id: any) {
  return request({
    url: `/cart/emptcart/${id}/`,
    method: "delete",
  });
}

/**
 * 读取购物车数据
 */
export function shoppingCartInfo(id: any) {
  return request({
    url: `/cart/cartget/${id}/`,
    method: 'get',
  });
}

/**
 * 购物车修改购买数量
 */
export function shoppingCartModifyNumber(data?: Recordable) {
  return request<ServiceResult<shoppingCartResult>>({
    url: `/shopping-cart/modifyNumber`,
    method: 'post',
    data,
  });
}

/**
 * 移除购物车中某条记录
 */
export function shoppingCartRemove(data?: Recordable) {
  return request<ServiceResult<shoppingCartResult>>({
    url: `/shopping-cart/remove`,
    method: 'post',
    data,
  });
}

/**
 * 购物车修改选中状态
 */
export function shoppingCartSelect(data?: Recordable) {
  return request<ServiceResult<shoppingCartResult>>({
    url: `/shopping-cart/select`,
    method: 'post',
    data,
  });
}

export default {
  shoppingCartAdd,
  shoppingCartEmpty,
  shoppingCartInfo,
  shoppingCartModifyNumber,
  shoppingCartRemove,
  shoppingCartSelect,
};
