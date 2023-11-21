<template>
  <div class="page">
    <div class="top">
      <ContainerDashboard :total-data="totalData" />
      <div class="divider"></div>
      <div class="right">
        <ContainerFilter @search="onSearch" />
        <div class="btn-row">
          <el-button
            type="primary"
            :icon="Plus"
            @click="onGoToAdd"
          >
            创建容器
          </el-button>
        </div>
      </div>
    </div>

    <el-tabs
      v-model="activeName"
      class="tabs"
    >
      <el-tab-pane
        label="全部"
        name="all"
      >
        <ContainerTable :list="list" />
      </el-tab-pane>
      <el-tab-pane
        label="运行中"
        :name="ContainerStatus.running"
      >
        <ContainerTable :list="list.filter(item => item.status === ContainerStatus.running)" />
      </el-tab-pane>
      <el-tab-pane
        label="已暂停"
        :name="ContainerStatus.paused"
      >
        <ContainerTable :list="list.filter(item => item.status === ContainerStatus.paused)" />
      </el-tab-pane>
      <el-tab-pane
        label="已停止"
        :name="ContainerStatus.exited"
      >
        <ContainerTable
          :list="list.filter(item => item.status === ContainerStatus.exited)"
          @reload="onReload"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import { ContainerStatus } from '@common/constants/enum';
import type { ContainerDetail } from '@common/types/container';

import { getContainerList } from '@/apis/container';

import ContainerTable from './containerTable.vue';
import ContainerDashboard from './containerDashboard.vue';
import ContainerFilter from './containerFilter.vue';
import type { FilterData } from './containerFilter.vue';

const activeName = ref('all');
const list = ref<ContainerDetail[]>([]);
const filter = ref({
  image: '',
  network: '',
  volume: '',
});
const totalData = ref({
  cpu: 0,
  cpuNum: 1,
  memoryUsage: 0,
  memoryLimit: 1,
});
const router = useRouter();

const getData = async (hasMetrics?: boolean) => {
  const res = await getContainerList({
    imageId: filter.value.image || undefined,
    networkId: filter.value.network || undefined,
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
  justify-content: space-evenly;
  height: 180px;
  .divider {
    height: 100%;
    border-left: solid 1px #e5e5e5;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .btn-row {
      text-align: right;
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
