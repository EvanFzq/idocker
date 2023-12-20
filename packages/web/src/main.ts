import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Vant from 'vant';
import 'vant/lib/index.css';
import Antd, { message } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import 'material-icons/iconfont/material-icons.css';

import { routes } from '@/constants/routes';

import App from './App.vue';
import './style.css';

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const app = createApp(App);
app.use(router);
app.use(Vant);
app.use(Antd);

app.mount('#app');

message.config({
  maxCount: 2,
});

console.info(import.meta.env);
