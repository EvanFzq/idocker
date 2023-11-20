<template>
  <div>
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
import { ref, onMounted } from 'vue';

import { ContainerStatus } from '@common/constants/enum';
import type { ContainerDetail } from '@common/types/container';

import { getContainerList } from '@/apis/container';

import ContainerTable from './containerTable.vue';

const activeName = ref('all');
const list = ref<ContainerDetail[]>([]);

const getData = async (hasMetrics?: boolean) => {
  const res = await getContainerList({ hasMetrics });
  if (res.success) {
    list.value = res.data;
  }
};

onMounted(async () => {
  getData();
  setInterval(() => {
    getData(true);
  }, 5000);
});

const onReload = async () => {
  getData();
};
</script>
