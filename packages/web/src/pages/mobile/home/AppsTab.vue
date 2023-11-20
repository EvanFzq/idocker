<template>
  <div class="apps-tab">
    <van-nav-bar
      title="导航"
      left-text="独立页"
      left-arrow
      @click-left="onOpenAlonePage"
      @click-right="isLocal = !isLocal"
    >
      <template #right>
        <van-tag
          round
          size="medium"
          :type="isLocal ? 'primary' : 'success'"
        >
          {{ isLocal ? '局域网' : '外网' }}
          <van-icon
            name="exchange"
            color="#fff"
            style="margin-left: 4px"
          />
        </van-tag>
      </template>
    </van-nav-bar>
    <AppsPage :is-local="isLocal" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import AppsPage from '@/pages/mobile/apps/AppsPage.vue';

const isLocal = ref(true);

const onOpenAlonePage = () => {
  window.open(isLocal.value ? '/apps/local' : '/apps/internet');
};
</script>
<style lang="less" scoped>
.apps-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
