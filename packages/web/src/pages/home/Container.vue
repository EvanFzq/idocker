<template>
  <div class="list">
    <ContainerCard
      v-for="item in containerList"
      :key="item.id"
      :id="item.id"
      :name="item.name"
      :image="item.image"
      :startedAt="item.startedAt"
      :status="item.status"
      :created="item.created"
      :labels="item.labels"
      :icon="item.icon"
      :cpu="item.cpu"
      :memory_limit="item.memory_limit"
      :memory_usage="item.memory_usage"
      :disabled="item.disabled"
      @reload="onReload"
    />
    <p class="no-more">没有更多了</p>
  </div>
</template>

<script lang="ts" setup>
import { getContainerList, getContainerStats } from '@/apis';
import { onMounted, ref, onUnmounted } from 'vue';

// import { } from '@/types/container'
import { ContainerFormat } from '@/types/container';

import ContainerCard from '@/components/ContainerCard.vue';

const containerList = ref<ContainerFormat[]>([]);
let statsTimer: NodeJS.Timeout;

const getList = async () => {
  // 获取列表
  const res = await getContainerList();
  if (res.success) {
    const list = res.data.map(item => ({
      id: item.Id,
      name: item.Name.slice(1),
      disabled: item.disabled,
      image: item.Config.Image,
      status: item.State.Status,
      startedAt: item.State.StartedAt,
      created: item.Created,
      labels: item.Config.Labels,
      icon:
        item.Config.Labels['com.docker.desktop.extension.icon'] ||
        item.Config.Labels['net.unraid.docker.icon'],
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
  statsTimer = setInterval(async () => {
    getData();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(statsTimer);
});
</script>

<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.no-more {
  width: 100%;
  font-size: 10px;
  margin: 12px 12px 48px;
  text-align: center;
}
</style>
