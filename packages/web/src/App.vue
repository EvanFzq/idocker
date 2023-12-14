<template>
  <div class="page">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['HomePage']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { isMobile } from '@/utils/utils';

const router = useRouter();
// 判断显示页面类型 ，白名单路径不做处理
const whitelist = ['/apps/local', '/apps/internet', '/about'];
if (!whitelist.includes(location.pathname)) {
  if (
    (isMobile() && !location.pathname.startsWith('/m')) ||
    (!isMobile() && !location.pathname.startsWith('/d'))
  ) {
    // 判断当前路径是否和设备类型一致，不一致进行跳转
    router.push({
      path: isMobile() ? '/m' : '/d/container/list',
    });
  }
}
</script>
<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
