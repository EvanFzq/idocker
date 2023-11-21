<template>
  <el-container style="height: 100%">
    <el-header style="padding: 0">
      <DesktopHeader />
    </el-header>
    <el-container style="flex: auto; height: 0">
      <el-aside
        class="aside"
        :width="isOpen ? '160px' : '64px'"
      >
        <AsideMenu
          :is-open="isOpen"
          @change="onAsideChange"
        />
      </el-aside>
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <keep-alive :include="['HomePage']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import AsideMenu from '@/components/desktop/AsideMenu.vue';
import DesktopHeader from '@/components/desktop/DesktopHeader.vue';

const isOpen = ref(true);
const onAsideChange = (open: boolean) => {
  isOpen.value = open;
};
</script>
<style scoped lang="less">
.aside {
  transition: 0.3s;
}
.main {
  height: 100%;
  padding: 0;
}
</style>
