<template>
  <div class="network-list-page">
    <NetworkFilter @reload="getList()" />
    <NetworkTable
      :list="list"
      :loading="loading"
      @reload="getList()"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { Network } from '@common/types/network';

import { getNetworkList } from '@/apis';

import NetworkTable from './networkTable.vue';
import NetworkFilter from './networkFilter.vue';

const list = ref<Network[]>([]);
const loading = ref(false);

const getList = async () => {
  loading.value = true;
  const res = await getNetworkList();
  if (res.success) {
    list.value = res.data;
  }
  loading.value = false;
};

onMounted(async () => {
  getList();
});
</script>
<style scoped lang="less">
.network-list-page {
  padding: 24px;
}
</style>
