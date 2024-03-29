import { defineComponent } from 'vue';
import styles from './index.module.less';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'Copyright',
  setup() {
    return () => {
      const nowYear = dayjs().format('YYYY');
      return (
        <div class={styles.copyright}>
          <div class={styles.copyrightP}>
            <a href="https://github.com/JoeshuTT/v-shop" target="_blank">
              制作者：李可-{nowYear}年毕业设计
            </a>
          </div>
          <div class={styles.copyrightP}>
            <a href="https://github.com/JoeshuTT/v-shop" target="_blank">
              {__APP_INFO__.pkg.name}
            </a>
          </div>
          <div class={styles.copyrightP}>
            <a href="https://github.com/JoeshuTT/v-shop" target="_blank">
              最后发布时间： {__APP_INFO__.lastBuildTime}
            </a>
          </div>
        </div>
      );
    };
  },
});
