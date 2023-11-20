import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Vant from 'vant';
import 'vant/lib/index.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
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
app.use(ElementPlus);

app.mount('#app');

console.info(import.meta.env);
