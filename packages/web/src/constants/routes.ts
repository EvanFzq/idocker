import MobilePage from '@/pages/mobile/mobilePage.vue';
import DesktopPage from '@/pages/desktop/desktopPage.vue';
import HomePage from '@/pages/mobile/home/HomePage.vue';
import LoginPage from '@/pages/mobile/login/LoginPage.vue';
import ContainerDetailPage from '@/pages/mobile/containerDetail/ContainerDetailPage.vue';
import containerList from '@/pages/mobile/containerList/containerList.vue';
import CreateOrEditContainerPage from '@/pages/mobile/createOrEditContainer/CreateOrEditContainerPage.vue';
import ImageListPage from '@/pages/mobile/imageList/ImageListPage.vue';
import NetworkListPage from '@/pages/mobile/networkList/NetworkListPage.vue';
import VolumeListPage from '@/pages/mobile/volumeList/VolumeListPage.vue';
import AppsPage from '@/pages/mobile/apps/AppsPage.vue';
import AppSettingPage from '@/pages/mobile/setting/AppSettingPage.vue';
import UserSettingPage from '@/pages/mobile/setting/UserSettingPage.vue';
import NoticeSettingPage from '@/pages/mobile/setting/NoticeSettingPage.vue';
import DesktopContainerListPage from '@/pages/desktop/containerList/containerListPage.vue';
import DesktopContainerDetailPage from '@/pages/desktop/containerDetail/containerDetailPage.vue';

export const routes = [
  {
    path: '/m',
    component: MobilePage,
    children: [
      { path: '/m', component: HomePage },
      { path: '/m/login', component: LoginPage },
      { path: '/m/container', component: CreateOrEditContainerPage },
      { path: '/m/container/list', component: containerList },
      { path: '/m/container/:id', component: ContainerDetailPage },
      { path: '/m/image/list', component: ImageListPage },
      { path: '/m/network/list', component: NetworkListPage },
      { path: '/m/volume/list', component: VolumeListPage },
      { path: '/m/apps/local', component: AppsPage },
      { path: '/m/apps/internet', component: AppsPage },
      { path: '/m/apps/setting', component: AppSettingPage },
      { path: '/m/user/setting', component: UserSettingPage },
      { path: '/m/notice/setting', component: NoticeSettingPage },
    ],
  },
  { path: '/d/login', component: LoginPage },
  {
    path: '/d',
    component: DesktopPage,
    children: [
      { path: '/d', component: DesktopContainerListPage },
      { path: '/d/container', component: DesktopContainerListPage },
      { path: '/d/container/:id', component: DesktopContainerDetailPage },
    ],
  },
];
