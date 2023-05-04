<script lang="ts" setup>
import {onBeforeMount, onMounted, reactive, ref, unref} from 'vue';
import { useRoute } from 'vue-router';

import API_ORDER from '@/apis/order';
import ProList from '@/components/ProList/index.vue';
import OrderItem from './components/OrderItem.vue';
import { orderListModel } from '@/model/modules/order/list';
import { useUserStore } from  '@/store/modules/user'
import {router} from "@/router";

onBeforeMount(() => {
  const { status } = route.query;
  if (status) {
    active.value = unref(tabList).findIndex((item) => item.status === status);
  }
});
const route = useRoute();
const tabList = ref<Recordable[]>([
  { name: '全部', status: '' },
  { name: '待付款', status: '0' },
  { name: '待发货', status: '1' },
  { name: '待收货', status: '2' },
  { name: '已完成', status: '3' },
]);
const active = ref(0);

function onTabClicked() {
  listQueryType.value = 'query';
  listRef.value?.refresh();
}

const keyword = ref<string>('');

function onSearch() {
  // loadList()
  listQueryType.value = 'search';
  listRef.value?.refresh();
}

const listRef = ref<any>(null);

const pagination = reactive({
  pageCurrent: 1,
  pageSize: 10,
});
const listQueryType = ref('query');
const listEmptyText = ref('暂无订单');

function onOrderDelete(_item, index) {
  listRef.value?.deleteItemByIndex(index);
}

function loadList() {
  const params: Recordable = {
    currentPage: pagination.pageCurrent,
    size: pagination.pageSize,
    status: unref(tabList)[unref(active)].status,
  };

  if (unref(keyword)) {
    params.order_no = unref(keyword); // 订单编号
  }

  listEmptyText.value = unref(listQueryType) === 'search' ? '未找到符合条件数据' : '暂无订单';

  return API_ORDER.orderList(useUserStore().userInfo.id,params);
}

function loadListAfter(data) {
  const records = orderListModel(data?.orderList ?? [], data?.goodsMap ?? []);
  return records;
}
</script>

<template>
  <div class="container">
    <van-sticky>
      <div class="header">
        <form action="#" class="search-form">
          <van-search
            v-model="keyword"
            class="search-field"
            shape="round"
            show-action
            placeholder="搜索订单（订单编号）"
            @search="onSearch"
            @clear="onSearch"
          >
            <template #action>
              <div v-if="keyword" style="color: #1ba784" @click="onSearch">订单搜索</div>
              <div v-else style="color: #1ba784" @click="router.push( '/mine' )">个人中心</div>
            </template>
          </van-search>
        </form>
        <van-tabs v-model:active="active" @click-tab="onTabClicked">
          <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name" />
        </van-tabs>
      </div>
    </van-sticky>
    <ProList
      ref="listRef"
      :api="loadList"
      :after-fetch="loadListAfter"
      :pagination="pagination"
      :empty-text="listEmptyText"
    >
      <template #item="{ item, index ,first}">
        <OrderItem :key="item.id" :item="item" :first="first" :index="index" @delete="onOrderDelete" />
      </template>
    </ProList>
  </div>
</template>

<style lang="less" scoped>
//
</style>
