<template>
  <TitleBar
    v-if="title"
    :title="title"
  />
  <div class="list">
    <ContainerCard
      v-for="item in containerList"
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
import { useRoute } from 'vue-router';

import type { ContainerFormat } from '@/types/container';
import type { ContainerListParams } from '@common/types/container';
import ContainerCard from '@/components/ContainerCard.vue';
import TitleBar from '@/components/TitleBar.vue';
import { computed } from 'vue';

const containerList = ref<ContainerFormat[]>([]);
let statsTimer: NodeJS.Timeout;
const route = useRoute();
const { type, name, id } = route.query;

const title = computed(() => {
  const containerListTitle: Record<string, string> = {
    image: `镜像 ${name} 的容器`,
    network: `网络 ${name} 的容器`,
  };
  return type ? containerListTitle[type as string] : '';
});

const getList = async () => {
  // 获取列表
  const params: Record<string, ContainerListParams> = {
    ['network']: {
      networkId: id as string,
    },
    ['image']: {
      imageId: id as string,
    },
  };
  const res = await getContainerList(type ? params[type as string] : undefined);
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
  margin: 12px 12px 72px;
  text-align: center;
}
</style>
