<template>
  <div class="network-list-page">
    <NetworkFilter @reload="getList()" />
    <NetworkTable
      :list="list"
      :container-list="containerList"
      :loading="loading"
      @reload="onReload"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { Network } from '@common/types/network';
import type { ContainerDetail } from '@common/types/container';

import { getNetworkList, getContainerList } from '@/apis';

import NetworkTable from './networkTable.vue';
import NetworkFilter from './networkFilter.vue';

const list = ref<Network[]>([]);
const containerList = ref<ContainerDetail[]>([]);
const loading = ref(false);

const getList = async () => {
  loading.value = true;
  const res = await getNetworkList();
  if (res.success) {
    list.value = res.data;
  }
  loading.value = false;
};

const getContainerData = async () => {
  const res = await getContainerList();
  if (res.success) {
    containerList.value = res.data;
  }
};

onMounted(async () => {
  getList();
  getContainerData();
});

const onReload = () => {
  getList();
  getContainerData();
};
</script>
<style scoped lang="less">
.network-list-page {
  padding: 24px;
}
</style>
