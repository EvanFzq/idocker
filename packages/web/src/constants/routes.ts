import HomePage from '@/pages/home/HomePage.vue';
import LoginPage from '@/pages/login/LoginPage.vue';
import ContainerDetailPage from '@/pages/containerDetail/ContainerDetailPage.vue';
import CreateContainerPage from '@/pages/createContainer/CreateContainerPage.vue';
import ImageListPage from '@/pages/imageList/ImageListPage.vue';

export const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/container/:id', component: ContainerDetailPage },
  { path: '/container/new', component: CreateContainerPage },
  { path: '/image/list', component: ImageListPage },
];
