import { assets } from '@/constants';
import { mobileShow } from '@/utils/format';

/**
 * 后端评价转换前端评价数
 * @description // 只有 0 差评 1 中评 2 好评
 */
export function rate2Reputation(val: number) {
  switch (val) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    default:
      return 5;
  }
}

/**
 * 前端评价转换后端评价数
 * @description // 只有 0 差评 1 中评 2 好评
 */
export function reputation2Rate(val: number) {
  switch (val) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    default:
      return 3;
  }
}

/**
 *  商品评价
 * @param {*} data
 */
export function goodReputationModel(data: any) {
  return data.map((v: any) => ({
    customer__img__path: v.customer__img__path || assets.avatar,
    customer__username: v.customer__username || (v.customer__username ? mobileShow(v.customer__username) : `神秘用户`),
    grade: rate2Reputation(v.grade),
    remark: v.remark || '此用户没有填写评价',
    date: v.created_time,
  }));
}
