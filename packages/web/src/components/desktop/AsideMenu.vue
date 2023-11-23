<template>
  <div class="aside">
    <div class="menu-list">
      <a-menu
        default-active="/d/container"
        :inline-collapsed="collapsed"
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
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { ref, h } from 'vue';

defineProps<{ collapsed: boolean }>();
const router = useRouter();

const items = ref([
  {
    key: '/d/container',
    icon: () => h(PlayCircleOutlined),
    label: '容器',
    title: '容器',
  },
  {
    key: '/d/image',
    icon: () => h(AppstoreOutlined),
    label: '镜像',
    title: '镜像',
  },
  {
    key: '/d/network',
    icon: () => h(ApartmentOutlined),
    label: '网络',
    title: '网络',
  },
  {
    key: '/d/vol',
    icon: () => h(FileOutlined),
    label: '数据',
    title: '数据',
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
