import MobilePage from '@/pages/mobile/mobilePage.vue';
import DesktopPage from '@/pages/desktop/desktopPage.vue';
import AppsPage from '@/pages/mobile/apps/AppsPage.vue';

export const routes = [
  { path: '/apps/local', component: AppsPage },
  { path: '/apps/internet', component: AppsPage },
  {
    path: '/m',
    component: MobilePage,
    children: [
      { path: '/m', component: () => import('@/pages/mobile/home/HomePage.vue') },
      { path: '/m/login', component: () => import('@/pages/mobile/login/LoginPage.vue') },
      {
        path: '/m/container',
        component: () =>
          import('@/pages/mobile/createOrEditContainer/CreateOrEditContainerPage.vue'),
      },
      {
        path: '/m/container/list',
        component: () => import('@/pages/mobile/containerList/containerList.vue'),
      },
      {
        path: '/m/container/:id',
        component: () => import('@/pages/mobile/containerDetail/ContainerDetailPage.vue'),
      },
      {
        path: '/m/image/list',
        component: () => import('@/pages/mobile/imageList/ImageListPage.vue'),
      },
      {
        path: '/m/network/list',
        component: () => import('@/pages/mobile/networkList/NetworkListPage.vue'),
      },
      {
        path: '/m/volume/list',
        component: () => import('@/pages/mobile/volumeList/VolumeListPage.vue'),
      },

      {
        path: '/m/apps/setting',
        component: () => import('@/pages/mobile/setting/AppSettingPage.vue'),
      },
      {
        path: '/m/user/setting',
        component: () => import('@/pages/mobile/setting/UserSettingPage.vue'),
      },
      {
        path: '/m/notice/setting',
        component: () => import('@/pages/mobile/setting/NoticeSettingPage.vue'),
      },
    ],
  },
  { path: '/d/login', component: () => import('@/pages/desktop/login/LoginPage.vue') },
  {
    path: '/d',
    component: DesktopPage,
    children: [
      {
        path: '/d/container/list',
        component: () => import('@/pages/desktop/containerList/containerListPage.vue'),
      },
      {
        path: '/d/container/:id',
        component: () => import('@/pages/desktop/containerDetail/containerDetailPage.vue'),
      },
      {
        path: '/d/container/newOrEdit',
        component: () =>
          import('@/pages/desktop/createOrEditContainer/createOrEditContainerPage.vue'),
      },
      {
        path: '/d/image/list',
        component: () => import('@/pages/desktop/imageList/imageListPage.vue'),
      },
      {
        path: '/d/network/list',
        component: () => import('@/pages/desktop/networkList/networkListPage.vue'),
      },
      {
        path: '/d/volume/list',
        component: () => import('@/pages/desktop/volumeList/volumeListPage.vue'),
      },
      { path: '/d/:error*', component: () => import('@/pages/desktop/error404/ErrerPage.vue') },
    ],
  },
];
