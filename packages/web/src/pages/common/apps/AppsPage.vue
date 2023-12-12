<template>
  <div
    v-show="list.length === 0"
    class="loading-box"
  >
    <van-loading v-if="loading" />
    <van-empty
      v-else
      description="暂无内容"
    />
  </div>

  <div
    v-show="list.length !== 0"
    ref="bgRef"
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
  <van-floating-bubble
    class="switch-wallpaper"
    :offset="{ x: -20, y: offsetY }"
    :gap="20"
    axis="xy"
    magnetic="x"
    @click="onSwitchWallpaper"
  >
    <img
      ref="switchWallpaperRef"
      width="40"
      height="40"
      :src="switchWallpaperImg"
    />
  </van-floating-bubble>
</template>
<script setup lang="ts">
import { computed, ref, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type { AppInfo } from '@common/types/setting';

import { getApps } from '@/apis/setting';
import { getWallpaper, switchWallpaper } from '@/apis/setting';
import switchWallpaperImg from '@/assets/switch-wallpaper.webp';

interface AppsPageProps {
  isLocal?: boolean;
}
const props = defineProps<AppsPageProps>();
const route = useRoute();
const isLocalEnv = computed(() => props.isLocal || route.path === '/apps/local');
const list = ref<AppInfo[]>([]);
const loading = ref(true);
const offsetY = document.documentElement.clientHeight - 110;
const switchWallpaperRef = ref<HTMLImageElement | null>(null);
const bgRef = ref<HTMLDivElement | null>(null);
const switching = ref(false);

watchEffect(async () => {
  loading.value = true;
  const res = await getApps(isLocalEnv.value);
  if (res.success) {
    list.value = res.data;
  }
  loading.value = false;
});

const onSwitchWallpaper = async () => {
  if (switching.value === true) {
    return;
  }
  switching.value = true;
  const img = switchWallpaperRef.value;
  if (img) {
    let deg = 0;
    const timer = setInterval(() => {
      deg += 10;
      img.style.transform = `rotate(${deg}deg) rotateZ(0deg)`;
    }, 16);
    const res = await switchWallpaper();
    if (res.success && bgRef.value) {
      bgRef.value.style.backgroundImage = `url("${res.data.src}")`;
    }
    clearInterval(timer);
    // 1秒停止旋转
    let startTime = Date.now();
    const timer2 = setInterval(() => {
      const step = 10 - (Date.now() - startTime) / 100;
      if (step <= 0) {
        clearInterval(timer2);
        return;
      }
      deg += step;
      img.style.transform = `rotate(${deg}deg) rotateZ(0deg)`;
    }, 16);
  }
  switching.value = false;
};
onMounted(async () => {
  const res = await getWallpaper();
  if (res.success && res.data.src && bgRef.value) {
    bgRef.value.style.backgroundImage = `url("${res.data.src}")`;
  }
});
const onClickApp = (app: AppInfo) => {
  window.open(app.url, '_blank', 'noreferrer,noopener');
};
</script>
<style lang="less" scoped>
.loading-box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-list {
  padding: 10px;
  display: grid;
  flex: auto;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-gap: 10px;
  justify-content: space-evenly;
  align-content: flex-start;
  background-size: cover;
  background-position: center;
  .app {
    background-color: #fff;
    border-radius: 8px;
    border: solid #aaa 1px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 6px;
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
.switch-wallpaper {
  background-color: #fff !important;
  box-shadow: 1px 1px 2px #ccc;
}
</style>
