import '@/utils/helpers/vconsole';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { store } from './store';

// Vant
import Vant, { Lazyload } from 'vant';
import 'vant/lib/index.less';

// guard
import './router/guard';

// global
import './styles/index.less';

// app
const app = createApp(App);

app.use(Lazyload);
app.use(Vant);
app.use(router);
app.use(store);
app.mount('#app');
