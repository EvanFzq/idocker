<template>
  <div
    v-if="list.length === 0"
    class="loading-box"
  >
    <van-loading v-if="loading" />
    <van-empty
      v-else
      description="暂无内容"
    />
  </div>

  <div
    v-else
    class="app-list"
  >
    <div
      v-for="app in list"
      :key="app.name"
      class="app"
      @click="onClickApp(app)"
    >
      <van-image
        class="icon"
        :src="app.icon"
      />
      <div class="name">
        <div :class="app.status === 'running' || !app.status ? 'dot normal' : 'dot fail'"></div>
        <span>{{ app.name }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

import type { AppInfo } from '@common/types/container';

import { getApps } from '@/apis/container';

interface AppsPageProps {
  isLocal?: boolean;
}
const props = defineProps<AppsPageProps>();
const route = useRoute();
const isLocalEnv = computed(() => props.isLocal || route.path === '/apps/local');
const list = ref<AppInfo[]>([]);
const loading = ref(true);

watchEffect(async () => {
  loading.value = true;
  const res = await getApps(isLocalEnv.value);
  if (res.success) {
    list.value = res.data;
  }
  loading.value = false;
});

const onClickApp = (app: AppInfo) => {
  window.open(app.url, '_blank', 'noreferrer,noopener');
};
</script>
<style lang="less" scoped>
.loading-box {
  height: 0;
  width: 100%;
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-list {
  margin: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-gap: 10px;
  justify-content: space-evenly;
  align-content: center;
  .app {
    background-color: #fff;
    border-radius: 6px;
    border: solid #eee 1px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 6px;
    box-shadow: 1px 1px 2px #eee;
    .icon {
      width: 66px;
      height: 66px;
      border-radius: 4px;
      overflow: hidden;
    }
    .name {
      font-size: 10px;
      text-align: center;
      margin-top: 4px;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 6px;
      margin-right: 4px;
      &.normal {
        background-color: #07c160;
      }
      &.fail {
        background-color: #f60;
      }
    }
  }
}
@media screen and (min-width: 640px) {
  .app-list {
    grid-template-columns: repeat(auto-fill, 120px);
    grid-gap: 14px;
    .app {
      padding: 10px;
      border-radius: 10px;
      .icon {
        width: 100px;
        height: 100px;
        border-radius: 6px;
      }
      .name {
        font-size: 14px;
      }
    }
  }
}
</style>
<style>
.app.van-grid-item {
  .van-grid-item__content {
    padding: 10px;
  }
}
</style>
