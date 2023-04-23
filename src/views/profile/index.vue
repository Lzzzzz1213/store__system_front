<script lang="ts" setup>
import { computed, onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import type { AreaColumnOption } from 'vant';
import API_USER from '@/apis/user';
import AffixBarAction from '@/components/AffixBarAction/index.vue';
import Upload from '@/components/Upload/index.vue';
import { isEmpty } from '@/utils/validate';
import { assets } from '@/constants';
import moment from "moment";
import AreaField from '@/components/AreaField/index.vue';

import { useUserStore } from '@/store/modules/user';

onMounted(() => {
  getUserDetail()
});

const router = useRouter();
const userStore = useUserStore();
const server = import.meta.env.VITE_APP_SERVER_IP

const userInfo = computed(() => userStore.getUserInfo);

const email = ref('');
const phone = ref('');
const img_path = ref('');
const last_login = ref('');
const username = ref('');
const id = ref(0);
const img = ref(0);
// const areaLabel = computed(() => {
//   if (!unref(province)) {
//     return '';
//   }
//
//   if (unref(province) === unref(city)) {
//     return unref(city);
//   }
//
//   return `${unref(province)} - ${unref(city)}`;
// });

function onFileSuccess(res: any) {
  img_path.value = `http://${server}/demo/api/img${res.data.path}`;
}

// function onAreaChange(values: Array<AreaColumnOption>) {
//   province.value = values[0].name;
//   city.value = values[1].name;
// }

function onSubmit() {
  if (
    unref(avatarUrl) === unref(userInfo).avatarUrl &&
    unref(nick) === unref(userInfo).nick &&
    unref(province) === unref(userInfo).province &&
    unref(city) === unref(userInfo).city
  ) {
    Toast('您没有修改任何东西哦');
    return;
  }
  if (isEmpty(unref(nick))) {
    Toast('昵称不能为空');
    return;
  }

  if (isEmpty(unref(province))) {
    Toast('所在地不能为空');
    return;
  }

  const params = {
    nick: unref(nick),
    avatarUrl: unref(avatarUrl),
    province: unref(province),
    city: unref(city),
  };

  Toast.loading({
    forbidClick: true,
    message: '提交中...',
    duration: 0,
  });

  API_USER.userModify(params)
    .then(() => {
      Toast('资料修改成功');
      router.back();
    })
    .catch((error) => {
      console.error(error);
    });
}

function getUserDetail() {
  API_USER.userDetail(userStore.userInfo.id)
    .then((res) => {
      email.value = res.data[0].email
      phone.value = res.data[0].phone
      img_path.value = `http://${server}/demo/api/img/media/${res.data[0].img_path}`;
      last_login.value = moment(res.data[0].last_login).format('YYYY-MM-DD HH:mm:ss')
      username.value = res.data[0].username
      id.value = res.data[0].id
  })
    .catch((error) => {
      console.log(error)
    })

}
</script>

<template>
  <div class="container">
    <div class="header">
      <Upload @on-success="onFileSuccess">
        <div class="avatar">
          <van-image class="avatar-img" :src="img_path || assets.avatar" />
          <div class="avatar-title">点击更换头像</div>
        </div>
      </Upload>
    </div>
    <div class="nick van-hairline--bottom">
      <div class="nick-label">用户名</div>
      <van-field v-model="username" readonly />
    </div>
    <div class="nick van-hairline--bottom">
      <div class="nick-label">手机号</div>
      <van-field v-model="phone" readonly />
    </div>
    <div class="nick van-hairline--bottom">
      <div class="nick-label">邮箱号</div>
      <van-field v-model="email" readonly />
    </div>
    <div class="nick van-hairline--bottom">
      <div class="nick-label">上次登录时间</div>
      <van-field v-model="last_login" readonly />
    </div>
<!--    <AreaField-->
<!--      :model-value="areaLabel"-->
<!--      label="所在地"-->
<!--      placeholder="点击选择城市"-->
<!--      input-align="right"-->
<!--      :border="false"-->
<!--      :columns-num="2"-->
<!--      @change="onAreaChange"-->
<!--    />-->

    <AffixBarAction @submit="onSubmit" />
  </div>
</template>

<style lang="less" scoped>
.header {
  box-sizing: border-box;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &-img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 10px;
  }

  &-title {
    font-size: 14px;
    color: var(--gray-color-8);
  }
}
.nick {
  padding: 0 16px;
  background: var(--white);

  &.van-hairline--bottom::after {
    right: -40%;
    left: -40%;
  }

  &-label {
    font-size: 14px;
    font-weight: bold;
    color: var(--gray-color-8);
  }

  .van-field {
    padding: 10px 0;
  }
}

.field {
  :deep(.van-field__label) {
    font-size: 14px;
    font-weight: bold;
    color: var(--gray-color-8);
  }
}
</style>
