import HomePage from '@/pages/home/HomePage.vue';
import LoginPage from '@/pages/login/LoginPage.vue';
import ContainerDetailPage from '@/pages/containerDetail/ContainerDetailPage.vue';
import containerList from '@/pages/containerList/containerList.vue';
import CreateOrEditContainerPage from '@/pages/createOrEditContainer/CreateOrEditContainerPage.vue';
import ImageListPage from '@/pages/imageList/ImageListPage.vue';
import NetworkListPage from '@/pages/networkList/NetworkListPage.vue';
import VolumeListPage from '@/pages/volumeList/VolumeListPage.vue';
import AppsPage from '@/pages/apps/AppsPage.vue';
import AppSettingPage from '@/pages/appsSetting/AppSettingPage.vue';
import UserSettingPage from '@/pages/userSetting/UserSettingPage.vue';

export const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/container', component: CreateOrEditContainerPage },
  { path: '/container/list', component: containerList },
  { path: '/container/:id', component: ContainerDetailPage },
  { path: '/image/list', component: ImageListPage },
  { path: '/network/list', component: NetworkListPage },
  { path: '/volume/list', component: VolumeListPage },
  { path: '/apps/local', component: AppsPage },
  { path: '/apps/internet', component: AppsPage },
  { path: '/apps/setting', component: AppSettingPage },
  { path: '/user/setting', component: UserSettingPage },
];
