<script lang="ts" setup>
import { computed, onMounted, ref, unref, reactive, UnwrapNestedRefs, Prop  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';
import Captcha from '@/components/Captcha/index.vue';
import PwdField from '@/components/PwdField/index.vue';
import { nickList } from '@/constants/modules/user';
import { isMobile, isPassWord, isSame } from '@/utils/validate';
import { randomIntegerInRange } from '@/utils/lodash';
import { Field, Form } from 'vant'
import { useUserStore } from '@/store/modules/user';
import { useSmsCode } from '@/hooks/shared/useSmsCode';

const userStore = useUserStore();
type InferPropType<T> = T extends null
  ? any
  : T extends { type: null | true }
    ? any
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? { [key: string]: any }
      : T extends Prop<infer V, infer _>
        ? V
        : T

type FieldRule = UnwrapNestedRefs<InferPropType<typeof import('vant').Field>['rules'][number]>
onMounted(() => {
});

const router = useRouter();
const route = useRoute();

const title = ref('免费注册');
const formData = reactive({
  username: "",
  password: "",
  email: "",
  id_card: "",
  phone: "",
  head_portrait_url: "https://img2.woyaogexing.com/2023/01/17/d2ca4e40164bd990d83e51d066b8053e.jpg",
  type: "customer"
})
const form = reactive({
  username: '',
  password: '',
  email: '',
  id_card: '',
  phone: ''
})

const agree = ref(true);

const submitLoading = ref(false);

// 验证用户名长度是否符合要求
const validateUsernameLength = (rule: any, value: any, callback: Function) => {
  if (value && (value.length < 6 || value.length > 20)) {
    return callback(new Error("用户名长度必须在 6-20 个字符之间"))
  }
  callback()
}

// 验证邮箱格式是否正确
const validateEmailFormat = (rule: any, value: any, callback: Function) => {
  // 正则表达式用于验证邮箱格式
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if (value && !reg.test(value)) {
    return callback(new Error("请输入正确的邮箱格式"))
  }
  callback()
}

// 验证手机号长度是否等于11位
const validateMobileLength = (rule: any, value: any, callback: Function) => {
  if (value && value.length !== 11) {
    return callback(new Error("手机号码长度必须为11位"))
  }
  callback()
}

// 验证身份证格式是否正确
const validateIdCardFormat = (rule: any, value: any, callback: Function) => {
  const checkDate = (year: number, month: number, day: number) => {
    const date = new Date(`${year}/${month}/${day}`)
    return (
      date.getFullYear() === Number(year) && date.getMonth() + 1 === Number(month) && date.getDate() === Number(day)
    )
  }
  if (!value) {
    return callback(new Error("请输入身份证号码"))
  }
  const len = value.length
  if (len !== 18) {
    return callback(new Error("请输入18位身份证号码"))
  }
  if (!/^\d{17}(\d|x)$/i.test(value)) {
    return callback(new Error("身份证号码格式错误"))
  }
  // 加权因子 Weight factor
  const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 身份证号码校验码的设置
  const VerificationCode = "10X98765432"
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += Number(value[i]) * Wi[i]
  }
  const modValue = sum % 11
  const checkCode = value[17].toUpperCase() === "X" ? 10 : Number(value[17])
  if (checkCode === Number(VerificationCode[modValue]) || (checkCode === 10 && modValue === 2)) {
    const birthYear = value.slice(6, 10)
    const birthMonth = value.slice(10, 12)
    const birthDay = value.slice(12, 14)
    if (!checkDate(birthYear, birthMonth, birthDay)) {
      return callback(new Error("身份证号码格式错误"))
    }
    const sex = Number(value[16]) % 2 === 0 ? "女" : "男"
    callback()
  } else {
    return callback(new Error("身份证号码格式错误"))
  }
}
const validatePasswordLength = (rule: any, value: any, callback: Function) => {
  if (value && (value.length < 6 || value.length > 20)) {
    return callback(new Error("密码长度必须在 6-20 个字符之间"))
  }
  callback()
}
interface FormRules {
  username: {
    required: boolean
    trigger: string
    message: string
  }[],
  password: {
    required: boolean
    trigger: string
    message: string
  }[],
  email: {
    required: boolean
    trigger: string
    message: string
  }[],
  id_card: {
    required: boolean
    trigger: string
    message: string
  }[],
  phone: {
    required: boolean
    trigger: string
    message: string
  }[]
}
const formRules: FormRules = {
  username: [
    { required: true, trigger: 'blur', message: '请输入用户名' },
    { validator: validateUsernameLength, trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { validator: validatePasswordLength, trigger: 'blur' }
  ],
  email: [
    { required: true, trigger: 'blur', message: '请输入邮箱' },
    { validator: validateEmailFormat, trigger: 'blur' }
  ],
  id_card: [
    { required: true, trigger: 'blur', message: '请输入身份证' },
    { validator: validateIdCardFormat, trigger: 'blur' }
  ],
  phone: [
    { required: true, trigger: 'blur', message: '请输入手机号' },
    { validator: validateMobileLength, trigger: 'blur' }
  ]
}

const formErrorMessage = reactive({
  username: '',
  password: '',
  email: '',
  id_card: '',
  phone: ''
})

const onSubmit = () => {
  console.log(form)
}
</script>

<template>
  <div class="container">
    <div class="main">
      <div class="h2">{{ title }}</div>
      <div class="form">
        <div class="form-item">
          <div class="form-item-country">用户名</div>
          <van-field
            v-model="formData.username"
            class="form-field"
            :border="false"
            :rules="formRules.username"
            type="tel"
            placeholder="请输入用户名"
            clearable
          />
        </div>
        <div class="form-item">
          <div class="form-item-country">密码</div>
          <PwdField
            key="pwd"
            v-model="formData.password"
            class="form-field"
            :border="false"
            placeholder="请设置8-25位(数字+字母)密码"
            clearable
          />
        </div>
        <div class="form-item">
          <div class="form-item-country">邮箱</div>
          <van-field
            v-model="formData.email"
            class="form-field"
            :border="false"
            type="tel"
            placeholder="请输入邮箱"
            clearable
          />
        </div>
        <div class="form-item">
          <div class="form-item-country">身份证</div>
          <van-field
            v-model="formData.id_card"
            class="form-field"
            :border="false"
            type="tel"
            placeholder="请输入身份证"
            clearable
          />
        </div>
        <div class="form-item">
          <div class="form-item-country">手机号</div>
          <van-field
            v-model="formData.phone"
            class="form-field"
            :border="false"
            type="tel"
            placeholder="请输入手机号"
            clearable
          />
        </div>
        <van-button
          class="form-submit"
          block
          :disabled="!submitted"
          :loading="submitLoading"
          loading-text="注册中..."
          type="primary"
          @click="onSubmit"
          >确定</van-button
        >
      </div>
    </div>
    <div class="footer">
      <div class="footer-agreement">
        <van-checkbox v-model="agree" icon-size="16px" />
        <span> 阅读并同意</span><a href="javascript:void(0);">《用户协议》</a>和<a href="javascript:void(0);"
          >《隐私政策》</a
        >
      </div>
    </div>
    <!-- 图形验证码 -->
<!--    <Captcha v-model:show="captchaShow" @success="onSmsSend" />-->
  </div>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 30px;
}

.h2 {
  margin-top: 40px;
  font-size: 24px;
  font-weight: bold;
  color: var(--gray-color-8);
  line-height: 24px;
}

.safe-tips {
  font-size: 14px;
  color: var(--gray-color-6);
  margin-top: 20px;
  line-height: 14px;
}

.main {
  flex: 1;
  min-height: 420px;
}

.form {
  &-item {
    padding: 20px 0 10px;
    border-bottom: 1px solid @border-color;
    display: flex;
    align-items: center;
    font-size: 14px;

    &-country {
      padding-right: 10px;
      margin-right: 10px;
      color: var(--gray-color-8);
      position: relative;

      &::after {
        display: block;
        content: ' ';
        width: 1px;
        height: 14px;
        background: @border-color;
        position: absolute;
        top: 50%;
        margin-top: -7px;
        right: 0;
      }
    }
  }

  &-field {
    flex: 1;
    background: none;
    padding: 0;
  }

  &-submit {
    margin-top: 30px;
    font-size: 16px;
  }
}

.sms-btn {
  color: #38f;
  font-size: 14px;
  margin-left: 10px;

  &.countdown {
    font-size: 12px;
    color: var(--gray-color-6);
  }
}

.check-type {
  box-sizing: border-box;
  padding: 20px 0;
  font-size: 12px;
  color: #38f;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-separate {
    display: inline-flex;
    color: @border-color;
    margin: 0 5px 0 5px;
  }
}

.footer {
  margin-bottom: 30px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  &-agreement {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--gray-color-6);

    .van-checkbox {
      margin-right: 6px;
    }

    a {
      color: #38f;
    }
  }
}

.icon-random {
  display: block;
  width: 20px;
  height: 20px;
}
</style>
