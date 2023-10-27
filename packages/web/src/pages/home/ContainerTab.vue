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
      <!-- <van-tabs shrink>
        <van-tab title="更新">
          <van-button
            size="small"
            type="primary"
            style="margin-top: 12px"
          >
            检查更新
          </van-button>
        </van-tab>
      </van-tabs> -->
    </van-popup>
    <div class="list">
      <ContainerCard
        v-for="item in list"
        :id="item.id"
        :key="item.id"
        :name="item.name"
        :image="item.image"
        :started-at="item.startedAt"
        :status="item.status"
        :created="item.created"
        :labels="item.labels"
        :icon="item.icon"
        :cpu="item.cpu"
        :memory-limit="item.memory_limit"
        :memory-usage="item.memory_usage"
        :disabled="item.disabled"
        :local-url="item.localUrl"
        :internet-url="item.internetUrl"
        @reload="onReload"
      />
      <p class="no-more">没有更多了</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, onUnmounted, onActivated, onDeactivated } from 'vue';

import { getContainerList, getContainerStats } from '@/apis';
import type { ContainerFormat } from '@/types/container';
import { webUrlTemplateFormat } from '@/utils/utils';
import ContainerCard from '@/components/ContainerCard.vue';

const containerList = ref<ContainerFormat[]>([]);

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
        return (b.memory_usage || 0) - (a.memory_usage || 0);
      default:
        return a.name.charCodeAt(0) - b.name.charCodeAt(0);
    }
  });
  return list;
});
let statsTimer: NodeJS.Timeout;

const getList = async () => {
  // 获取列表
  const res = await getContainerList();
  if (res.success) {
    const list = res.data.map(item => ({
      id: item.Id,
      name: item.Name.slice(1),
      image: item.Config.Image,
      status: item.State.Status,
      startedAt: item.State.StartedAt,
      created: item.Created,
      labels: item.Config.Labels,
      icon:
        item.Config.Labels['docker.mobile.icon'] ||
        item.Config.Labels['com.docker.desktop.extension.icon'] ||
        item.Config.Labels['net.unraid.docker.icon'],
      localUrl: webUrlTemplateFormat(item.Config.Labels['docker.mobile.localUrl'], item),
      internetUrl: webUrlTemplateFormat(item.Config.Labels['docker.mobile.internetUrl'], item),
    }));
    return list;
  } else {
    return [];
  }
};

const getData = async () => {
  // 获取列表同时获取cpu、内存信息
  const list = await getList();
  if (list.length > 0) {
    const statsRes = await getContainerStats(list.map(item => item.id));
    if (statsRes.success) {
      containerList.value = list.map(item => {
        const statsData = statsRes.data.find(stats => stats.id === item.id);
        return {
          ...item,
          cpu: statsData?.cpu,
          memory_usage: statsData?.memory_usage,
          memory_limit: statsData?.memory_limit,
        };
      });
    }
  }
};

const onReload = async () => {
  getData();
};

onMounted(async () => {
  const list = await getList();
  containerList.value = list;
  getData();
  clearInterval(statsTimer);
  statsTimer = setInterval(async () => {
    getData();
  }, 5000);
});

onActivated(async () => {
  const list = await getList();
  containerList.value = list;
  getData();
  clearInterval(statsTimer);
  statsTimer = setInterval(async () => {
    getData();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(statsTimer);
});
onDeactivated(() => {
  clearInterval(statsTimer);
});
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

.no-more {
  width: 100%;
  font-size: 10px;
  margin: 12px 12px 72px;
  text-align: center;
}
</style>
