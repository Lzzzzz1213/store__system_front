<script lang="ts" setup>
import {onMounted, reactive, ref, unref} from 'vue';
import { Toast } from 'vant';
import API_USER from '@/apis/user';
import API_SCORE from '@/apis/score';
import AffixBarAction from '@/components/AffixBarAction/index.vue';
import { scoreDeductionRuleModel } from '@/model/modules/score/deductionRule';
import { countPair } from '@/utils/format';
import {useUserStore} from "@/store/modules/user";

onMounted(() => {
  getDetail();
});

const type = ref(2);
const scoreNumber = ref(0);
const detail = ref<Recordable>({});
const rule = ref<Recordable>({});
const balance = ref<number>(0)
const params = reactive({
  amount: 0,
  customer_id: 0
})
function getDetail() {
  API_USER.myWalletApi(useUserStore().userInfo.id).then((res) => {
    balance.value = res.balance ?? 0
  })
  // API_USER.userAmount().then((res) => {
  //   detail.value = res.data || {};
  // });
  //
  // API_SCORE.scoreDeductionRules({ type: unref(type) }).then((res) => {
  //   if (res.data?.length) {
  //     rule.value = scoreDeductionRuleModel(res.data[0]);
  //   }
  // });
}

function onSubmit() {
  if (!unref(scoreNumber)) {
    Toast('请输入充值金额');
    return;
  }
  params.amount = unref(scoreNumber)
  params.customer_id = useUserStore().userInfo.id as number

  Toast.loading({
    forbidClick: true,
    message: '加载中...',
    duration: 0,
  });

  API_USER.walletPaymentApi(params).then((res) => {
    console.log(res)
    window.location.href = res.request.responseURL
  })
    .catch((error) => {
      console.log(error)
    })
  // API_SCORE.scoreExchangeCash(params)
  //   .then(() => {
  //     Toast('兑换成功');
  //     getDetail();
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-count">
        <span class="header-count-label">我的余额:</span>
        <span class="header-count-value">{{ countPair(balance) }}</span>
      </div>
    </div>
    <van-field v-model="scoreNumber" type="digit" label="充值金额" placeholder="请输入充值金额" />
    <div v-if="rule.desc" class="tips">规则：{{ rule.desc }}</div>
    <!-- 完成 -->
    <AffixBarAction button-text="前往支付" @submit="onSubmit" />
  </div>
</template>

<style lang="less" scoped>
.header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 80px;
  background-image: linear-gradient(90deg, #6b6c85, #3a4053);
  color: #fff;
  text-align: center;
  font-size: 18px;
  overflow: hidden;
  margin-bottom: 20px;

  &-count {
    display: flex;
    align-items: center;

    &-value {
      font-size: 24px;
      font-weight: 500;
    }

    &-label {
      margin-left: 8px;
      font-size: 12px;
    }
  }
}

.tips {
  padding: 10px 15px;
  font-size: 12px;
  color: var(--gray-color-6);
}
</style>
