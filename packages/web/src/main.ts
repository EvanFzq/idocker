import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import {
  Tabbar,
  TabbarItem,
  Icon,
  Toast,
  Image as VanImage,
  Tag,
  Button,
  Dialog,
  NavBar,
  Circle,
  Tab,
  Tabs,
  Field,
  Form,
  Cell,
  CellGroup,
  Popover,
  Picker,
  Popup,
  Switch,
  Radio,
  RadioGroup,
  ActionSheet,
  TextEllipsis,
} from 'vant';
import { routes } from '@/constants/routes';
import './style.css';
import 'vant/lib/index.css';
import 'material-icons/iconfont/material-icons.css';
import App from './App.vue';

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes,
});
const app = createApp(App);
app.use(router);

app.use(Icon);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Toast);
app.use(VanImage);
app.use(Tag);
app.use(Button);
app.use(Dialog);
app.use(NavBar);
app.use(Circle);
app.use(Tab);
app.use(Tabs);
app.use(Field);
app.use(Form);
app.use(Cell);
app.use(CellGroup);
app.use(Popover);
app.use(Picker);
app.use(Popup);
app.use(Switch);
app.use(Radio);
app.use(RadioGroup);
app.use(ActionSheet);
app.use(TextEllipsis);

app.mount('#app');

console.info(import.meta.env);
