<script lang="ts">
import {defineComponent, unref} from 'vue';
import { Toast } from 'vant';
import Compressor from 'compressorjs';
import API_DFS from '@/apis/dfs';
import API_USER from '@/apis/user';

export default defineComponent({
  name: 'Upload',
  emits: ['on-success', 'on-error'],
  setup(_props, { emit }) {
    function beforeRead(file): any {
      return new Promise((resolve) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          success: (result) => {
            resolve(result);
          },
          error: (error) => {
            console.error(`[Compressor error]`, error);
            emit('on-error', error);
          },
        });
      });
    }
    function afterRead(file) {
      const formData = new FormData();
      formData.append("path", new File([file.file],file.file.name,file.file)) // 所有文件转为file
      formData.append("name", file.file.name)
      Toast.loading({
        forbidClick: true,
        message: '上传中...',
        duration: 2000,
      });

      API_DFS.uploadImg(formData)
        .then((res) => {
          console.log(res)
          Toast("上传成功")
          setTimeout(()=>{
            Toast.clear();
          },3000)
          if (res.data.id) {
            emit('on-success', res);
          } else {
            Toast({
              message: res.data.msg,
              duration: 1500,
            });
            emit('on-error', res);
          }
        })
        .catch((error) => {
          console.log(error)
          emit('on-error', error);
        });
    }

    return {
      beforeRead,
      afterRead,
    };
  },
});
</script>

<template>
  <van-uploader :before-read="beforeRead" :after-read="afterRead" accept=".jpeg,.png,.jpg" > <slot /> </van-uploader>
</template>
