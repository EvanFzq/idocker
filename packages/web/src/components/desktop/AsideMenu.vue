<template>
  <div class="aside">
    <div class="menu-list">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        :inline-collapsed="collapsed"
        mode="inline"
        :items="items"
        @click="onMenuSelect"
      >
      </a-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  PlayCircleOutlined,
  AppstoreOutlined,
  ApartmentOutlined,
  FileOutlined,
  SettingOutlined,
  UserOutlined,
  NotificationOutlined,
} from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import { ref, h } from 'vue';

defineProps<{ collapsed: boolean }>();
const router = useRouter();
const route = useRoute();
const selectedKeys = ref([route.path]);

const items = ref([
  {
    key: '/d/container/list',
    icon: () => h(PlayCircleOutlined),
    label: '容器',
    title: '容器',
  },
  {
    key: '/d/image/list',
    icon: () => h(AppstoreOutlined),
    label: '镜像',
    title: '镜像',
  },
  {
    key: '/d/network/list',
    icon: () => h(ApartmentOutlined),
    label: '网络',
    title: '网络',
  },
  {
    key: '/d/volume/list',
    icon: () => h(FileOutlined),
    label: '数据',
    title: '数据',
  },
  {
    key: '/d/setting',
    icon: () => h(SettingOutlined),
    label: '设置',
    title: '设置',
    children: [
      {
        icon: () => h(UserOutlined),
        key: '/d/setting/user',
        label: '用户信息',
        title: '用户信息',
      },
      {
        icon: () => h(NotificationOutlined),
        key: '/d/setting/notice',
        label: '通知',
        title: '通知',
      },
    ],
  },
]);

const onMenuSelect = ({ key }: { key: string }) => {
  router.push(key);
};
</script>
<style scoped lang="less">
.aside {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .menu-list {
    flex: auto;
    overflow: auto;
    border-right: solid 1px #e5e5e5;
    background-color: #fff;
  }
  .collapse-btn {
    flex: none;
    border-radius: 0;
  }
}
</style>
