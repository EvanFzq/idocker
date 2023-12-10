<template>
  <div class="page">
    <div class="top">
      <ContainerDashboard :total-data="totalData" />
      <div class="divider"></div>
      <div class="right">
        <ContainerFilter
          :default-value="filter"
          @search="onSearch"
        />
        <div class="btn-row">
          <a-button
            type="primary"
            :icon="h(PlusOutlined)"
            @click="onGoToAdd"
          >
            创建容器
          </a-button>
        </div>
      </div>
    </div>

    <a-tabs
      v-model:activeKey="activeName"
      class="tabs"
    >
      <a-tab-pane
        key="all"
        tab="全部"
      >
        <ContainerTable :list="list" />
      </a-tab-pane>
      <a-tab-pane
        :key="ContainerStatus.running"
        tab="运行中"
      >
        <ContainerTable :list="list.filter(item => item.status === ContainerStatus.running)" />
      </a-tab-pane>
      <a-tab-pane
        :key="ContainerStatus.paused"
        tab="已暂停"
      >
        <ContainerTable :list="list.filter(item => item.status === ContainerStatus.paused)" />
      </a-tab-pane>
      <a-tab-pane
        :key="ContainerStatus.exited"
        tab="已停止"
      >
        <ContainerTable
          :list="list.filter(item => item.status === ContainerStatus.exited)"
          @reload="onReload"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';

import { ContainerStatus } from '@common/constants/enum';
import type { ContainerDetail } from '@common/types/container';

import { getContainerList } from '@/apis/container';

import ContainerTable from './containerTable.vue';
import ContainerDashboard from './containerDashboard.vue';
import ContainerFilter from './containerFilter.vue';
import type { FilterData } from './containerFilter.vue';

const router = useRouter();
const route = useRoute();

const activeName = ref('all');
const list = ref<ContainerDetail[]>([]);
const filter = ref<FilterData>({
  image: route.query.imageId ? (route.query.imageId as string) : null,
  network: route.query.networkName ? (route.query.networkName as string) : null,
  volume: route.query.volumeName ? (route.query.volumeName as string) : null,
});
const totalData = ref({
  cpu: 0,
  cpuNum: 1,
  memoryUsage: 0,
  memoryLimit: 1,
});

const getData = async (hasMetrics?: boolean) => {
  const res = await getContainerList({
    imageId: filter.value.image || undefined,
    networkName: filter.value.network || undefined,
    volumeName: filter.value.volume || undefined,
    hasMetrics,
  });
  if (res.success) {
    list.value = res.data;
    const nextTotalData = {
      cpu: 0,
      cpuNum: 1,
      memoryUsage: 0,
      memoryLimit: 1,
    };
    res.data.forEach(item => {
      nextTotalData.cpuNum = item.cpuNum ? item.cpuNum : nextTotalData.cpuNum;
      nextTotalData.cpu += item.cpu || 0;
      nextTotalData.memoryLimit = item.memoryLimit ? item.memoryLimit : nextTotalData.memoryLimit;
      nextTotalData.memoryUsage += item.memoryUsage || 0;
    });
    totalData.value = nextTotalData;
  }
};

let timer: NodeJS.Timeout;
onMounted(async () => {
  await getData();
  await getData(true);
  timer = setInterval(() => {
    getData(true);
  }, 5000);
});
// 清理定时器
onUnmounted(() => {
  clearInterval(timer);
});

const onReload = async () => {
  getData();
};
const onSearch = (filterData: FilterData) => {
  filter.value = filterData;
  getData();
};
const onGoToAdd = () => {
  router.push('/d/container/newOrEdit');
};
</script>
<style scoped lang="less">
.page {
  padding: 24px;
}
.top {
  display: flex;
  justify-content: space-between;
  .divider {
    min-height: 180px;
    margin: 0 56px;
    flex: none;
    border-left: solid 1px #e5e5e5;
  }
  .right {
    flex: auto;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .btn-row {
      text-align: right;
      flex: none;
    }
  }
}
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>
