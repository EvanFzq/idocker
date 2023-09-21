<template>
  <TitleBar title="网络列表" />
  <NetworkCard
    v-for="network in networkList"
    :key="network.Id"
    :network="network"
  />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
import { getNetworkList } from '@/apis/network';
import type { Network } from '@common/types/network';
import NetworkCard from './NetworkCard.vue';

const networkList = ref<Network[]>([]);

onMounted(async () => {
  const res = await getNetworkList();
  if (res.success) {
    networkList.value = res.data;
  }
});
</script>
