<template>
  <div class="container-tab">
    <van-nav-bar
      title="容器列表"
      @click-right="showSetting = true"
    >
      <template #right>
        <van-icon
          name="setting-o"
          size="18"
        />
      </template>
    </van-nav-bar>
    <van-popup
      v-model:show="showSetting"
      position="right"
      :style="{ width: '40%', height: '100%', padding: '6px' }"
    >
      <van-tabs shrink>
        <van-tab title="过滤">
          <van-radio-group
            v-model="containerStatus"
            class="options"
          >
            <van-radio name="all">全部（{{ containerList.length }}）</van-radio>
            <van-radio name="running">
              运行中（
              {{ containerList.filter(item => item.status === 'running').length }}
              ）
            </van-radio>
            <van-radio name="paused">
              已暂停（
              {{ containerList.filter(item => item.status === 'paused').length }}
              ）
            </van-radio>
            <van-radio name="exited">
              已关闭（
              {{ containerList.filter(item => item.status === 'exited').length }}
              ）
            </van-radio>
          </van-radio-group>
        </van-tab>
      </van-tabs>
      <van-divider />
      <van-tabs shrink>
        <van-tab title="排序">
          <van-radio-group
            v-model="sortType"
            class="options"
          >
            <van-radio name="name">名称</van-radio>
            <van-radio name="cpu">CPU使用率</van-radio>
            <van-radio name="memory_usage">内存使用量</van-radio>
          </van-radio-group>
        </van-tab>
      </van-tabs>
      <van-divider />
      <van-tabs shrink>
        <van-tab title="更新">
          <van-button
            size="small"
            type="primary"
            style="margin-top: 12px"
            @click="onCheckUpdate"
          >
            检查更新
          </van-button>
        </van-tab>
      </van-tabs>
    </van-popup>
    <div
      v-if="!loading"
      class="list"
    >
      <ContainerCard
        v-for="item in list"
        :id="item.id"
        :key="item.id"
        :name="item.name"
        :image="item.image"
        :started-at="item.startedAt"
        :status="item.status"
        :labels="item.labels"
        :icon="item.icon"
        :cpu="item.cpu"
        :memory-limit="item.memoryLimit"
        :memory-usage="item.memoryUsage"
        :is-self="item.isSelf"
        :can-update="item.canUpdate"
        @reload="onReload"
      />
      <p class="no-more">没有更多了</p>
    </div>
    <div
      v-else
      class="loading"
    >
      <van-loading />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, onUnmounted, onActivated, onDeactivated } from 'vue';
import { showToast } from 'vant';

import type { ContainerListItem } from '@common/types/container';

import { getContainerList, checkImageUpdate } from '@/apis';
import ContainerCard from '@/components/ContainerCard.vue';

const containerList = ref<ContainerListItem[]>([]);
const loading = ref(false);
const showSetting = ref(false);
const containerStatus = ref('all');
const sortType = ref('name');

const list = computed(() => {
  let list =
    containerStatus.value === 'all'
      ? containerList.value
      : containerList.value.filter(item => item.status === containerStatus.value);
  list = list.sort((a, b) => {
    switch (sortType.value) {
      case 'name':
        return a.name.charCodeAt(0) - b.name.charCodeAt(0);
      case 'cpu':
        return (b.cpu || 0) - (a.cpu || 0);
      case 'memory_usage':
        return (b.memoryUsage || 0) - (a.memoryUsage || 0);
      default:
        return a.name.charCodeAt(0) - b.name.charCodeAt(0);
    }
  });
  return list;
});
let statsTimer: NodeJS.Timeout;

const getList = async (hasMetrics: boolean) => {
  // 获取列表
  const res = await getContainerList({ hasMetrics });
  if (res.success) {
    containerList.value = res.data;
  } else {
    containerList.value = [];
  }
};

const onReload = async () => {
  loading.value = true;
  await getList(false);
  loading.value = false;
};

onMounted(async () => {
  loading.value = true;
  await getList(false);
  loading.value = false;
  clearInterval(statsTimer);
  statsTimer = setInterval(async () => {
    getList(true);
  }, 5000);
});

onActivated(async () => {
  await getList(false);
  clearInterval(statsTimer);
  statsTimer = setInterval(async () => {
    getList(true);
  }, 5000);
});

onUnmounted(() => {
  clearInterval(statsTimer);
});
onDeactivated(() => {
  clearInterval(statsTimer);
});

const onCheckUpdate = async () => {
  showSetting.value = false;
  showToast({
    message: '后台检查中...',
  });
  await checkImageUpdate(containerList.value.map(item => item.image));
  showToast({
    message: '检查完成！',
  });
};
</script>

<style scoped>
.container-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.options {
  & > div {
    margin: 8px;
    font-size: 12px;
  }
}

.list {
  width: 100%;
  flex: auto;
  height: 0;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
}
.loading {
  flex: auto;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-more {
  width: 100%;
  font-size: 10px;
  margin: 12px 12px 72px;
  text-align: center;
}
</style>
