<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#409eff',
      },
    }"
  >
    <a-layout>
      <a-layout-header
        class="header"
        style="background: #409eff"
      >
        <DesktopHeader />
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          v-model:collapsed="collapsed"
          collapsible
          :width="160"
          :collapsed-width="64"
          style="background: #fff"
        >
          <AsideMenu :collapsed="collapsed" />
        </a-layout-sider>
        <a-layout class="main">
          <router-view v-slot="{ Component }">
            <keep-alive :include="['HomePage']">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </a-layout>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import AsideMenu from '@/components/desktop/AsideMenu.vue';
import DesktopHeader from '@/components/desktop/DesktopHeader.vue';

const collapsed = ref(false);
</script>
<style scoped lang="less">
.main {
  height: 100%;
  padding: 0;
  overflow: auto;
}
</style>
<style>
.ant-layout-sider-trigger {
  background: #409eff !important;
}
</style>
