<script lang="ts" setup>
import { computed, onMounted, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';
import API_GOODS from '@/apis/goods';
import API_CART from '@/apis/cart';
import Plate from '@/components/Plate/index.vue';
import Sku from '@/components/Sku/index.vue';
import { ISku, IInitialSku } from '@/components/Sku/typings';
import Reputations from './components/Reputations.vue';

import { getAfterSaleTitle } from '@/model/modules/order/afterSale';

import { useOrderStore } from '@/store/modules/order';
import { useThrottleFn } from '@vueuse/core';
import {useUserStore} from "@/store/modules/user";


onMounted(() => {
  getGoodsDetail();
  setTimeout(()=>{
    getSkuData(commodityInfo.value, commodityDetail.value)
  },1000)
});
const server = import.meta.env.VITE_APP_SERVER_IP
const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const basicInfo = ref<Recordable>({});
const content = ref('');

const goodDeliveryTitle = computed(() => {
    return `包邮`;
});
const commodityInfo = ref<any>({
  pic: {
    path: ""
  },
  data: {
    id: undefined,
    created_time: "",
    name: "",
    item_no: undefined,
    price: "",
    introduction: "",
    category: "",
  }
})
const commodityDetail = ref({
  detail: "",
  pic: {
      path: ""
  },
  data: {
    store: "",
  }
})
function getGoodsDetail() {
  API_GOODS.goodsDetail( route.query.id ).then((res) => {
    commodityInfo.value.pic.path = res.pic[0].path
    commodityInfo.value.data.id = res.data.id
    commodityInfo.value.data.created_time = res.data.created_time
    commodityInfo.value.data.name = res.data.name
    commodityInfo.value.data.item_no = res.data.item_no
    commodityInfo.value.data.price = res.data.price
    commodityInfo.value.data.introduction = res.data.introduction
    commodityInfo.value.data.category = res.data.category
    content.value = commodityInfo.value.data.introduction
    document.title = unref(commodityInfo).data.name;
  });
  API_GOODS.goodDetail( route.query.id ).then((res) => {
    commodityDetail.value.detail = res.detail
    commodityDetail.value.pic.path = res.pic[0].path
    commodityDetail.value.data.store = res.data.store
    // getAfterService();
  })
}

// Sku
const skuNextActionType = ref('goBuy');
const skuShow = ref(false);
const sku = ref<ISku>({
  goodsId: 0,
  price: 0,
  stock: 0,
  goodInfo: {},
  propList: [],
  skuList: [],
});
const initialSku = ref<IInitialSku>({
  selectedNum: 1,
  selectedProps: {},
  selectedPropList: [],
});
function onSkuShow(type: string) {
  skuNextActionType.value = type;
  skuShow.value = true;
}

const onSkuConfirm = useThrottleFn(
  (data) => {
    skuShow.value = false;
    if (unref(skuNextActionType) === 'addCart') {
      addCartHandle();
    } else {
      orderStore.setTradeGoods({
        origin: 'buy',
        list: [
          {
            commodity_id: unref(sku).goodsId,
            commodity__name: unref(sku).goodInfo.name,
            number: unref(initialSku).selectedNum,
            commodity__img__path: unref(sku).goodInfo.pic,
            commodity__price: data.selectedSkuComb.price,
            // logisticsId: unref(basicInfo).logisticsId,
            // propertyList: unref(initialSku).selectedPropList,
          },
        ],
      });
    }
  },
  1000,
  false,
);
function getSkuData(Info, Detail) {
  sku.value = {
    goodsId: Info.data.id,
    price: Info.data.price,
    stock: Detail.data.store,
    goodInfo: {
      id: Info.data.id,
      pic: Info.pic.path,
      name: Info.data.name,
      unit: "件",
    },
    propList: [],
    skuList: [], // 按照商品价格从低到高排序
  };
}
const cart = ref<any>({
  customer: undefined,
  commodity: undefined,
  number: undefined
})
function addCartHandle() {
  cart.value.customer = useUserStore().userInfo.id
  cart.value.commodity = commodityInfo.value.data.id
  cart.value.number = unref(initialSku).selectedNum
  API_CART.shoppingCartAdd(unref(cart)).then((res) =>{
    Toast(res.msg)
  }).catch((error) =>{
    console.log(error)
  })
}
function onConcatService() {
  Toast('未开放：客服');
}

// 售后服务
const afterSaleTitle = ref('');
// function getAfterService() {
//   afterSaleTitle.value = getAfterSaleTitle(unref(basicInfo).afterSale);
// }
</script>

<template>
  <div class="container">
    <van-image class="swiper-item-img" fit="contain" :src="`http://${server}/demo/api/img/media/${commodityInfo.pic.path}`" alt="">
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>

    <div class="section">
      <div class="price">
        <div class="price-hd">
          <div class="price-current">
            <span class="price-current-symbol">¥</span>
            <span class="price-current-integer">{{ commodityInfo.data.price }}</span>
          </div>
        </div>
      </div>
      <div class="desc">
        <div class="desc-hd">
          <div class="desc-title van-multi-ellipsis--l2">{{ commodityInfo.data.name }} （商品编号:{{commodityInfo.data.item_no}}）</div>
          <div v-if="commodityInfo.data.introduction" class="desc-brief">
            {{ commodityInfo.data.introduction}}
          </div>
        </div>
      </div>
    </div>
    <!--有关于库存的结构-->
    <div class="stock van-hairline--top">
      <div class="stock-item">
        {{ goodDeliveryTitle }}
      </div>
      <div class="stock-item">剩余 {{ commodityDetail.data.store }}</div>
    </div>
    <van-cell>
      <template #title>
        <div class="cell-bar">
          <div class="cell-bar-title">服务</div>
          <div class="cell-bar-text">七天无理由退款</div>
        </div>
      </template>
    </van-cell>
    <Reputations class="mt10" :goods-id="route.query.id as number" />
    <Plate title="商品详情" class="mt10" />
    <div class="goods-content" v-html="content"></div>
    <van-image class="swiper-item-img" fit="contain" :src="`http://${server}/demo/api/img/media/${commodityDetail.pic.path}`" alt="">
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>

    <div class="action-bar-perch"></div>
    <!-- 商品导航栏 -->
    <van-action-bar>
      <van-action-bar-icon icon="thumb-circle-o" text="首页" to="/home" replace />
      <van-action-bar-icon icon="balance-pay" text="钱包" @click="router.push('/wallet')" />
      <van-action-bar-icon icon="cart-o" text="购物车" to="/cart" :badge="cartCount" replace />
      <van-action-bar-button type="warning" text="加入购物车" @click="onSkuShow('addCart')" />
      <van-action-bar-button type="danger" text="立即购买" @click="onSkuShow" />
    </van-action-bar>
    <!-- SKU 弹窗 -->
    <Sku v-model:show="skuShow" :sku="sku" :initial-sku="initialSku" @confirm="onSkuConfirm" />
  </div>
</template>

<style lang="less" scoped>
.section {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 15px 10px;
  background: #fff;
}

.swiper {
  width: 100%;
  height: 375px;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
}

.price {
  margin-top: 10px;

  &-current {
    display: flex;
    align-items: flex-end;
    align-items: center;
    margin-right: 8px;
    font-size: 16px;
    color: var(--brand-color);

    &-symbol {
      font-size: 14px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 22px;
      font-weight: bold;
      font-family: @font-family-price-integer;
    }
  }

  &-origin {
    display: flex;
    align-items: flex-end;
    align-items: center;
    margin-right: 8px;
    font-size: 12px;
    line-height: 18px;
    color: var(--gray-color-6);

    &-label {
      margin-right: 4px;
    }

    &-integer {
      text-decoration: line-through;
      font-family: @font-family-price-integer;
    }
  }

  &-tag {
    box-sizing: border-box;
    margin-left: 10px;
    display: inline-flex;
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 4px;
    color: #f44;
    border: 1px solid #f44;
  }
}

.desc {
  margin-top: 10px;

  &-title {
    font-size: 16px;
    line-height: 20px;
  }

  &-brief {
    margin-top: 4px;
    color: var(--gray-color-6);
    font-size: 12px;
    word-break: break-all;
  }
}

.stock {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #fff;
  margin-bottom: 10px;

  &-item {
    flex: 1;
    font-size: 12px;
    color: var(--gray-color-6);

    &:last-child {
      text-align: right;
    }
  }
}

.goods-content {
  box-sizing: border-box;
  background: #fff;
  padding: 0 10px;
  padding-top: 10px;
  overflow: hidden;
  color: var(--color-gray-8);
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  word-wrap: break-word;

  :deep(i)mg {
    display: block;
    max-width: 100% !important;
    height: auto !important;
  }

  :deep(p) {
    margin: 0;
    padding: 0;
  }
}

.mb10 {
  margin-bottom: 10px;
}

.mt10 {
  margin-top: 10px;
}

.cell-bar {
  display: flex;
  color: var(--gray-color-8);

  &-title {
    flex-shrink: 0;
    margin-right: 12px;
    color: var(--gray-color-6);
  }

  &-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}

.action-bar-perch {
  height: calc(50px + constant(safe-area-inset-bottom));
  height: calc(50px + env(safe-area-inset-bottom));
}
</style>
