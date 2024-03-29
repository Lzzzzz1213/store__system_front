import { request } from '@/utils/request';

export interface ILoginData {
  /** admin 或 editor */
  username: string
  /** 密码 */
  password: string
  /** 验证码 */
  // code: string
  type: string
}

interface IupHeadData {
  id?: number

  img?: number
}

/**
 * 查看用户资产
 */
export function userAmount(data?: Recordable) {
  return request({
    url: `/user/amount`,
    method: 'get',
    params: data,
  });
}

/**
 * 资金流水
 */
export function userCashLog(data?: Recordable) {
  return request({
    url: `/user/cashLog/v2`,
    method: 'post',
    data,
  });
}

/**
 * 查看用户详情
 */
// export function userDetail(data?: Recordable) {
//   return request({
//     url: `/user/detail`,
//     method: 'get',
//     params: data,
//   });
// }

/**
 * 修改用户信息
 */
export function userModify(data?: Recordable) {
  return request({
    url: `/user/modify`,
    method: 'get',
    params: data,
  });
}

/**
 * 退出登录
 */
export function userLoginOut(data?: string) {
  return request({
    url: "/user/logout/",
    method: 'post',
    params: data,
  });
}

/**
 * 绑定手机号码
 */
export function userMBindMobile(data?: Recordable) {
  return request({
    url: `/user/m/bind-mobile`,
    method: 'post',
    data,
  });
}

/**
 * 用户登录[手机号码]
 */
export function userMLogin(data?: Recordable) {
  return request({
    url: `/user/m/login`,
    method: 'post',
    data,
  });
}

/**
 * 使用手机号码和验证码登录
 */
export function userMLoginMobile(data?: Recordable) {
  return request({
    url: `/user/m/loginMobile`,
    method: 'post',
    data,
  });
}

/**
 * 用户注册[手机号]
 */
export function userMRegister(data?: Recordable) {
  return request({
    url: `/user/m/register`,
    method: 'post',
    data,
  });
}

/**
 * 重设登陆密码
 */
export function userMResetPwd(data?: Recordable) {
  return request({
    url: `/user/m/reset-pwd`,
    method: 'post',
    data,
  });
}

/**
 * 修改登陆密码
 */
export function userModifyPwd(data?: Recordable) {
  return request({
    url: `/user/modify/password`,
    method: 'post',
    data,
  });
}

/**
 * 添加收货地址
 */
export function userShoppingAddressAdd(data?: Recordable) {
  return request({
    url: "/address/list/",
    method: 'post',
    data,
  });
}

/**
 * 获取默认收货地址
 */
export function userShoppingAddressDefault(id: any) {
  console.log(id)
  return request({
    url: `/address/default/?customer_id=${id}`,
    method: 'get',
  });
}

/**
 * 删除收货地址
 */
export function userShoppingAddressDelete(data: any) {
  return request({
    url: `/address/list/${data.id}/`,
    method: 'delete',
  });
}

/**
 * 收货地址详情
 */
// export function userShoppingAddressDetail(data?: Recordable) {
//   return request({
//     url: `/user/shipping-address/detail/v2`,
//     method: 'get',
//     params: data,
//   });
// }

/**
 * 收货地址列表
 */
export function userShoppingAddressList(id: any) {
  return request({
    url: `/address/list/?customer_id=${id}`,
    method: 'get',
  });
}

/**
 * 修改收货地址
 */
export function userShoppingAddressUpdate(data: any) {
  console.log(data)
  return request({
    url: `/address/list/${data.id}/`,
    method: 'put',
    data,
  });
}

export function userShoppingAddressDetail(id: any){
  return request({
    url: `/address/detail/${id}/`,
    method: 'get',
  })
}

export function loginApi(data: ILoginData) {
  return request({
    url: "/user/login/",
    method: "post",
    data: data
  })
}

export function myWalletApi(id: any){
  return request({
    url: `/wallet/detail/${id}/`,
    method: "get"
  })
}

export function myWalletCountApi(id: any){
  return request({
    url: `/wallet/count/${id}`,
    method: "get"
  })
}

export function myWalletRechargeApi(id: any, params) {
  return request({
    url: `/wallet/recharge/${id}/`,
    method: "get",
    params
  })
}

export function myWalletConsumeApi(id: any, params) {
  return request({
    url: `/wallet/consume/${id}/`,
    method: "get",
    params
  })
}



import axios from "axios";
// import {Toast} from "vant";
const requestForPayment = axios.create({
  baseURL:'http://192.168.46.108:8080/pay'
})
export function walletPaymentApi(params){
  return requestForPayment({
    url: '/alipay',
    method: "get",
    params
  })
}

export function userDetail(id: any) {
  return request({
    url: `/user/detail/${id}/`,
    method: 'get'
  })
}

export function upHead(data: IupHeadData) {
  return request({
    url: '/user/head/',
    method: 'post',
    data: data
  })
}

export default {
  loginApi,
  userAmount,
  userCashLog,
  userDetail,
  userModify,
  // 登录/注册
  userLoginOut,
  userMBindMobile,
  userMLogin,
  userMLoginMobile,
  userMRegister,
  userMResetPwd,
  userModifyPwd,
  // 收货地址
  userShoppingAddressAdd,
  userShoppingAddressDefault,
  userShoppingAddressDelete,
  userShoppingAddressDetail,
  userShoppingAddressList,
  userShoppingAddressUpdate,
  // 我的钱包
  myWalletApi,
  myWalletCountApi,
  myWalletRechargeApi,
  myWalletConsumeApi,
  walletPaymentApi,
  // 更新用户数据
  upHead
};
