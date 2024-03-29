import { defineStore } from 'pinia';
import { store } from '@/store';
import storage from 'good-storage';
import { Toast, Dialog } from 'vant';
import { router } from '@/router';
import API_ORDER from '@/apis/order';

export interface ITradeGoodItem {
  commodity_id: string;
  commodity__name: string;
  number: number;
  commodity__img__path: string;
  commodity__price: number;
  logisticsId: number;
  propertyList: Array<any>;
}
export interface ITradeGoods {
  origin: string;
  list: ITradeGoodItem[];
}

export interface AppStore {
  tradeGoods: NonNullable<ITradeGoods>;
}

export const useOrderStore = defineStore({
  id: 'order',
  state: () => ({
    tradeGoods: storage.get('tradeGoods', {}),
  }),
  getters: {
    getTradeGoods: (state): ITradeGoods => state.tradeGoods,
  },
  actions: {
    /**
     * 下单结算商品信息汇总
     */
    async setTradeGoods(payload: Recordable = {}) {
      const { origin = 'buy', list = [], goOrder = true } = payload;
      let goodList: ITradeGoodItem[] = [];

      if (origin === 'cart') {
        list.forEach((v: any) => {
          goodList.push({
            commodity_id: v.commodity_id,
            commodity__name: v.commodity__name,
            number: v.number,
            commodity__img__path: v.commodity__img__path,
            commodity__price: v.commodity__price,
            logisticsId: v.logisticsId,
            propertyList: v.sku?.length
              ? v.sku.map((v: any) => ({
                  id: v.optionId,
                  name: v.optionName,
                  childId: v.optionValueId,
                  childName: v.optionValueName,
                  propIds: `${v.optionId}:${v.optionValueId}`,
                }))
              : [],
          });
        });
      } else {
        goodList = list;
      }

      const tradeGoods = {
        origin,
        list: goodList,
      };
      this.tradeGoods = tradeGoods;
      storage.set('tradeGoods', tradeGoods);

      goOrder && router.push('/order/submit');
    },
    /**
     * 删除订单
     * @description 只有已关闭、待支付、待评价、已评价的订单才可以删除
     */
    async deleteOrder(payload: Recordable = {}) {
      const { orderId } = payload;

      await Dialog.confirm({
        title: '确定删除订单？',
        message: '删除订单后无法恢复，无法处理您的售后问题，请慎重考虑。',
        cancelButtonText: '在考虑下',
        confirmButtonText: '删除',
      });

      Toast.loading({
        forbidClick: true,
        message: '加载中...',
        duration: 0,
      });

      await API_ORDER.orderDelete({ orderId });
    },
    /**
     * 关闭订单
     * @description 待付款的订单可以关闭
     */
    async closeOrder(payload: Recordable = {}) {
      const { orderId } = payload;

      await Dialog.confirm({
        title: '确定取消订单？',
        message: '订单还未付款,确定要取消吗？',
        cancelButtonText: '在考虑下',
        confirmButtonText: '取消订单',
      });

      Toast.loading({
        forbidClick: true,
        message: '加载中...',
        duration: 0,
      });

      await API_ORDER.orderClose({ orderId });
    },
  },
});

export function useOrderStoreWithOut() {
  return useOrderStore(store);
}
