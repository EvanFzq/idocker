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
// 判断当前路径是否和设备类型一致，不一致进行跳转
if (
  (isMobile() && !location.pathname.startsWith('/m')) ||
  (!isMobile() && !location.pathname.startsWith('/d'))
) {
  router.push({
    path: isMobile() ? '/m' : '/d/container',
  });
}
</script>
<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
